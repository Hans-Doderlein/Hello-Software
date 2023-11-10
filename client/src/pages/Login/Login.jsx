import { useMutation, useQuery } from "@apollo/client";
import { ClientLogin, TutorLogin } from "../../utils/mutations";
import { checkEmail, checkPassword } from "../../utils/validators";
import "../Login/Login.css";
import { useState, useRef, useEffect } from "react";

export function Login() {
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [tutorIsChecked, setTutorIsChecked] = useState(false);
  const [clientIsChecked, setClientIsChecked] = useState(true);
  const [isValidForm, setValidForm] = useState(false);
  const [isError, setError] = useState(false);
  const emailRef = useRef(null);
  const passRef = useRef(null);
  let formChecked = tutorIsChecked || clientIsChecked;

  const [mutateClient] = useMutation(ClientLogin);
  const [mutateTutor] = useMutation(TutorLogin);

  function resetForm() {
    setValidEmail(true);
    setValidPassword(true);
    setTutorIsChecked(false);
    setClientIsChecked(true);
    setValidForm(false);

    emailRef.current.value = "";
    passRef.current.value = "";
  }

  useEffect(() => {
    if (isValidForm) {
      const email = emailRef.current.value;
      const password = passRef.current.value;

      if (clientIsChecked && !tutorIsChecked) {
        mutateClient({
          variables: { loginInput: { email, password } },
        })
          .then(({ loading, data }) => {
            if (!loading) {
              if (data) {
                sessionStorage.setItem("token", data.clientLogin.token);
              } else {
                setError(true);
              }
            }
          })
          .catch((e) => setError(true))
          .finally(() => resetForm());
      } else if (tutorIsChecked && !clientIsChecked) {
        mutateTutor({
          variables: { loginInput: { email, password } },
        })
          .then(({ loading, data }) => {
            if (!loading) {
              if (data) {
                sessionStorage.setItem("token", data.tutorLogin.token);
              }
            }
          })
          .catch(() => setError(true))
          .finally(() => resetForm());
      } else resetForm();
    }
  }, [isValidForm]);

  const handleClient = (e) => {
    setClientIsChecked(!clientIsChecked);
    setTutorIsChecked(false);
  };
  const handleTutor = (e) => {
    setClientIsChecked(false);
    setTutorIsChecked(!tutorIsChecked);
  };

  function handleSubmit(e) {
    e.preventDefault();

    const email = emailRef.current.value;
    setValidEmail(checkEmail(email));
    const password = passRef.current.value;
    setValidPassword(checkPassword(password));

    setValidForm(email && password && formChecked);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="login-page">
          <div className="border">
            <div className="login-intro">
              <div className="top-info">
                <h1 className="login-title">Login</h1>
                <div className="toggles-login">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={clientIsChecked}
                      onChange={handleClient}
                    ></input>
                    <span className="slider round"> Client</span>
                  </label>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={tutorIsChecked}
                      onChange={handleTutor}
                    ></input>
                    <span className="slider round"> Tutor</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="login-boxes">
              <div>
                <input
                  className="email"
                  placeholder="  Email"
                  ref={emailRef}
                ></input>
              </div>
              <div>
                <input
                  className="password"
                  placeholder="  Password"
                  type="password"
                  ref={passRef}
                ></input>
              </div>
              <div>
                <button type="submit">Login</button>
              </div>
              <div>
                <p className="change-page">
                  Do not have an account yet?
                  <a href="/Signup" className="here">
                    Register Here
                  </a>
                </p>
              </div>
            </div>
            {isError ? <p>Login Failed</p> : null}
            {!formChecked ? <p>Please select either tutor or client</p> : null}
            {!validEmail ? <p>Please input a valid email!</p> : null}
            {!validPassword ? (
              <p>
                Password must contain at least one uppercase and number, and
                must be at least 8 characters long
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}
