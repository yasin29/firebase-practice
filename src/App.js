import { faFacebookF, faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import { GoogleAuthProvider, getAuth, signInWithPopup, GithubAuthProvider, FacebookAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import initializationAuthentication from './Firebase/firebase.init';
import { useState } from 'react';

initializationAuthentication();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

function App() {
  // hook 
  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [verify, setVerify] = useState('');
  const [reset, setReset] = useState('');
  const [firstname, setFirstName] = useState('');
  const [secondname, setSecondName] = useState('');

  // font awesome brand icon 
  const googleIcon = <FontAwesomeIcon icon={faGoogle} />
  const githubIcon = <FontAwesomeIcon icon={faGithub} />
  const facebookIcon = <FontAwesomeIcon icon={faFacebookF} />
  // auth 
  const auth = getAuth();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          img: photoURL
        }
        setUser(loggedInUser);
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          img: photoURL
        }
        setUser(loggedInUser);
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const handleFacebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          img: photoURL
        }
        setUser(loggedInUser);
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({});
        setIsLogin(false);
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const handleEmailSignUp = e => {
    setEmail(e.target.value);
  }
  const handlePassword = e => {
    setPassword(e.target.value);
  }

  const handleRegistration = e => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must contain at least six characters')
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('Password must contain two upper case letter')
      return;
    }
    if (!/(?=.*[!@#$&*])/.test(password)) {
      setError('Password must contain one special case letter');
      return;
    }
    if (!/(?=.*[0-9].*[0-9])/.test(password)) {
      setError('Password must contain two digits.');
      return;
    }
    if (!/(?=.*[a-z].*[a-z].*[a-z])/.test(password)) {
      setError('Password must contain three lowercase letters.');
      return;
    }

    isLogin ? handleLogin(email, password) : handleRegistrationConfirm(email, password);
  }

  const handleRegistrationConfirm = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        setError('');
        emailVerification();
        updateUserName();
        console.log(result.user)
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const loggedInUser = {
          name: displayName,
          email: email,
          img: photoURL
        }
        setUser(loggedInUser);
        console.log(result.user);
        setVerify('');
        setReset('');
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const handleToggle = e => {
    setIsLogin(e.target.checked);
  }
  const emailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setVerify('Verification email sent to your address');
      })
      .catch(error => {
        setError(error.message);
      })
  }
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setReset('Check your email for reset your password');
      })
      .catch(error => {
        setError(error.message);
      })
  }

  const updateUserName = () => {
    updateProfile(auth.currentUser, { displayName: firstname + " " + secondname })
      .then(() => {

      })
      .catch(error => {
        setError(error.message);
      })
  }
  const handleFirstName = e => {
    setFirstName(e.target.value);
  }
  const handleSecondName = e => {
    setSecondName(e.target.value);
  }



  return (
    <div className="App container w-25 fluid bg-light rounded mt-2 mx-auto">
      {
        !user.name ? <form onSubmit={handleRegistration}>
          <h2 className="fs-3 fw-bolder lh-lg font-monospace text-primary">{isLogin ? 'Login' : 'Create an account'}</h2>
          {
            !isLogin && <div className="row mb-3">
              <div className="col">
                <input onBlur={handleFirstName} type="text" className="form-control" placeholder="First name" aria-label="First name" required />
              </div>
              <div className="col">
                <input onBlur={handleSecondName} type="text" className="form-control" placeholder="Last name" aria-label="Last name" required />
              </div>
            </div>
          }
          <div className="row mb-3">

            <div className="col-sm-12">
              <input onBlur={handleEmailSignUp} type="email" className="form-control" id="inputEmail3" placeholder="your email" required />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12">
              <input onBlur={handlePassword} type="password" className="form-control" id="inputPassword3" placeholder="password" required />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12">
              <div className="form-group form-check d-flex justify-content-start">
                <input onChange={handleToggle} type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label ms-2" htmlFor="exampleCheck1">Already Registered?</label>
              </div>
            </div>
          </div>
          <p className="text-danger">{error}</p>
          {
            verify && <p className="text-success">{verify}</p>
          }
          {
            reset && <p className="text-success">{reset}</p>
          }
          <button type="submit" className="btn btn-primary mb-2"> {isLogin ? 'Login' : 'Sign up with email'} </button><br />

          <p>or use one of these options</p>
          <div className="d-flex justify-content-evenly p-3">
            <span onClick={handleGoogleSignIn} className="border border-dark p-2" style={{ cursor: "pointer" }}>{googleIcon}</span>
            <span onClick={handleGithubSignIn} className="border border-dark p-2" style={{ cursor: "pointer" }}>{githubIcon}</span>
            <span onClick={handleFacebookSignIn} className="border border-dark p-2" style={{ cursor: "pointer" }}>{facebookIcon}</span>
          </div>

          <button onClick={handleResetPassword} type="button" className="btn btn-outline-primary">Forget your password? Reset password</button>

        </form>
          :
          <button onClick={handleSignOut} type="submit" className="btn btn-primary mb-2"> Log Out </button>
      }
      {
        user.name && <div className="bg-info mb-4 rounded p-3">
          <h3>Login Information</h3>
          <h5>Name: {user.name} </h5>
          <p>Email:{user.email} </p>
          <img src={user.img} alt="" />
        </div>
      }
    </div>
  );
}

export default App;
