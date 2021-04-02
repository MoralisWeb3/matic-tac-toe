import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

pragma solidity ^0.8.0;

contract TicTacToe is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event Start(uint256 indexed gameId, address indexed player0, address indexed token, uint balance0);
    event Join(uint256 indexed gameId, address indexed player1, address indexed token, uint balance1);
    event Play(uint256 indexed gameId, uint turn, uint row, uint col);
    event Tie(uint256 indexed gameId, address indexed player0, address indexed player1);
    event Win(uint256 indexed gameId, address indexed winner);

    mapping (uint256 => Game) public games;

    // Main struct that contains all game's info
    struct Game
    {
        address token;
        address player0;
        address player1;
        uint balance0;
        uint balance1;
        uint turn;
        uint time_limit;
        mapping(uint => mapping(uint => uint)) board;
        bool isSet;
    }

    constructor() public ERC1155("") {}

    function start (address token, uint balance) public {
        ERC20(token).transferFrom(msg.sender, address(this), balance);
        
        _tokenIds.increment();
        uint256 newGameId = _tokenIds.current();
        Game storage g = games[newGameId];
        g.isSet = true;
        restart(newGameId);
        g.token = token;
        g.player0 = msg.sender;
        g.balance0 = balance;
        Start(newGameId, msg.sender, token, balance);
    }

    function join (uint256 gameId, uint balance) public {
        Game storage g = games[gameId];

        require(g.isSet && g.player1 == address(0) && g.balance0 == balance);

        ERC20(g.token).transferFrom(msg.sender, address(this), balance);

        g.player1 = msg.sender;
        g.balance1 = balance;
        Join(gameId, msg.sender, g.token, balance);
    }

    //This function is needed to play a move on the board,
    //take as arguments the wallet address of the host, row and columns where to put the sign
    //Positions schema:
    //[(0,0),(0,1),(0,2)]
    //[(1,0),(1,1),(1,2)]
    //[(2,0),(2,1),(2,2)]
    function play(uint256 gameId, uint row, uint column) public
    {
        Game storage g = games[gameId];

        //Assign an int to identify players, player -> 1, opposition -> 2
        require(msg.sender == g.player0 || msg.sender == g.player1, "User must be a member of game");
        
        uint8 player = 0;
        if(msg.sender == g.player1)
            player = 1;

        // Performs some checks to verify the correctness of the move:
        // 1 - There must be a bet value stored by the contract (balance)
        // 2 - There must be an opponent to play
        // 3 - You must play a move inside the board  0>=row>=2 and 0>=column>=2
        // 4 - There should be no other moves played on the same place
        // 5 - You must play in time w.r.t. TimeLimit
        // 6 - There must be your turn
        require(g.balance0 > 0, "There must be a bet value stored by the contract (balance)");
        require(g.player1 != address(0), "There must be an opponent to play");
        require(row >= 0 && row < 3 && column >= 0 && column < 3, "You must play a move inside the board  0>=row>=2 and 0>=column>=2");
        require(g.board[row][column] == 0, "There should be no other moves played on the same place");
        require(g.time_limit == 0 || block.timestamp <= g.time_limit, "You must play in time w.r.t. TimeLimit");
        require(g.turn == player, "Must be your turn");
        
        // Put the move in the board
        g.board[row][column] = player + 1;

        // If the board is full resend halved balance to each player
        if(is_board_full(gameId))
        {
            ERC20(g.token).transfer(g.player0, g.balance0);
            ERC20(g.token).transfer(g.player1, g.balance1);
            g.balance0 = 0;
            g.balance1 = 0;
            g.turn = 0;
            Tie(gameId, g.player0, g.player1);
            return;
        }

        // If the last move decreed a winner send thw whole balance to him
        // and restart the game
        if(is_winner(gameId, player))
        {
            if(player == 0)
                ERC20(g.token).transfer(g.player0, g.balance0 + g.balance1);
            else
                ERC20(g.token).transfer(g.player1, g.balance0 + g.balance1);

            g.balance0 = 0;
            g.balance1 = 0;
            g.turn = 0;
            if(player == 0)
                Win(gameId, g.player0);
            else 
                Win(gameId, g.player1);
            
            return;
        }

        // Set player's turn
        if (player == 0)
            g.turn = 1;
        else
            g.turn = 0;

        // Set time limit for the next move (in seconds), 10 minutes.
        g.time_limit = block.timestamp + (600);
        
        Play(gameId, player, row, column);
    }

    // This function is called in order to claim the reward in case the opponent
    // exceed the time limit.
    function claim_reward(uint256 gameId) public
    {
        Game storage g = games[gameId];

        if(g.player1 != address(0)
        && g.balance0 > 0
        && block.timestamp > g.time_limit)
        {
            if(g.turn == 0)
                ERC20(g.token).transfer(g.player1, g.balance0 + g.balance1);
            else
                ERC20(g.token).transfer(g.player0, g.balance0 + g.balance1);
            g.balance0 = 0;
            g.balance1 = 0;
            g.turn = 0;
        }
    }

    function check(uint256 gameId, uint player, uint r1, uint r2, uint r3,
    uint c1, uint c2, uint c3) private view returns (bool retVal)
    {
        Game storage g = games[gameId];
        if(g.board[r1][c1] == player + 1 && g.board[r2][c2] == player + 1
        && g.board[r3][c3] == player + 1)
            return true;
    }

    // Boolean function that verify wheter the board is in a winning condition or not
    function is_winner(uint256 gameId, uint player) private view returns (bool winner)
    {
        // Verify if there's a winning streak on diagonals
        if(check(gameId, player, 0, 1, 2, 0, 1, 2) || check(gameId, player, 0, 1, 2, 2, 1, 0))
            return true;

        // Verify if there's a winning streak on rows and columns
        for(uint r = 0; r < 3; r++)
            if(check(gameId, player, r, r, r, 0, 1, 2) || check(gameId, player, 0, 1, 2, r, r, r))
                return true;
    }

    // Booleand function that verify wheter the board is full or not
    // Simply counts number of signs, if thet are 9 then the board is full
    function is_board_full(uint256 gameId) private view returns (bool retVal)
    {
        Game storage g = games[gameId];
        uint count = 0;
        for(uint r = 0; r < 3; r++)
            for(uint c = 0; c < 3; c++)
                if(g.board[r][c] > 0)
                    count++;
        if(count >= 9)
            return true;
    }

    function restart(uint256 gameId) private
    {
        Game storage g = games[gameId];
        g.turn = 0;
        g.balance1 = 0;
        g.player1 = address(0);
        g.time_limit = 0;

        for(uint r = 0; r < 3; r++)
            for(uint c = 0; c < 3; c++)
                g.board[r][c] = 0;
    }

    // Debug function to print some attributes of the game
    function get_game_status(uint256 gameId) public view returns(address, uint, address, uint, address, uint, uint, uint, uint){
      Game storage g = games[gameId];
      uint row1 = (100 * (g.board[0][0] + 1)) + (10 * (g.board[0][1] + 1)) + (g.board[0][2] + 1);
      uint row2 = (100 * (g.board[1][0] + 1)) + (10 * (g.board[1][1] + 1)) + (g.board[1][2] + 1);
      uint row3 = (100 * (g.board[2][0] + 1)) + (10 * (g.board[2][1] + 1)) + (g.board[2][2] + 1);

      return (
              g.player0,
              g.balance0,
              g.player1,
              g.balance1,
              g.token,
              g.turn,
              row1,
              row2,
              row3
              );
    }

    // Debug function to print out the current block timestamp
    function get_blocktimestamp() public view returns(uint){
      return(block.timestamp);
    }
}