import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

type Alert = null|{
  icon?: ReactNode;
  show?: boolean;
  title?: string;
  image?: string;
  message?: string;
  subtitle?: string;
};

const initial: Alert = null

const AlertContext = createContext<
  [Alert, Dispatch<SetStateAction<Alert>>]
>([initial, () => {}]);
export const useAlertContext = () => useContext(AlertContext);
export const useSetAlert = () => useContext(AlertContext)[1];
export const AlertProvider = ({ children }) => {
  const value = useState<Alert>(initial);
  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

export const AlertDisplay = () => {
  const [alert, setAlert] = useAlertContext();

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
      <div
        className={alert?.show ? "toast show" : "toast hide"}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          {alert?.icon ? (
            alert?.icon
          ) : alert?.image ? (
            <img
              src={alert.image}
              className="rounded me-2"
              alt={alert?.title}
            />
          ) : null}
          <strong className="me-auto">{alert?.title}</strong>
          <small>{alert?.subtitle}</small>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => setAlert(null)}
          ></button>
        </div>
        <div className="toast-body">{alert?.message}</div>
      </div>
    </div>
  );
};
