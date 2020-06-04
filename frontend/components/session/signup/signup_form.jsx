import React from 'react';
import { validEmail, validName, validPassword } from "../../../util/validation_util";
import SignupInput from './signup_input';
import AttributedImage from '../../shared/attributed_image';

class SignupForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        terms: false,
      },
      displayError: {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        terms: false,
      },
      submitDisabled: false
    }

    this.validations = {
      firstName: validName,
      lastName: validName,
      email: validEmail,
      password: validPassword,
      terms: status => status
    }

    this.submit = this.submit.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.validateInput = this.validateInput.bind(this)
    this.validateForm = this.validateForm.bind(this)
  };

  submit(e) {
    e.preventDefault();
    if (this.validateForm()){
      this.props.signup(this.state.formData)
        .then(() => this.props.history.push('/polls'));
    } 
  }

  handleInput(field) {
    return e => {
      const value = (field === 'terms') ? e.target.checked : e.target.value
      const nextFormData = Object.assign({}, this.state.formData, { [field]: value });
      this.setState({ formData: nextFormData })
    }
  }
  
  _validate(field, value){
    const isValid = this.validations[field](value);
    
    
    this.setState( (state, props) => {
      const newDisplayError = Object.assign({}, state.displayError, {[field]: !isValid});
      return {displayError: newDisplayError};
    });
    return isValid;
  }

  validateInput(field) {
    return e => {
      const value = (field === 'terms') ? e.target.checked : e.target.value
      this._validate(field, value);

      const { submitDisabled, displayError } = this.state;

      if (submitDisabled && !Object.values(displayError).some( bool => bool)) {
        this.setState({submitDisabled: false})
      }
    }
  }
  
  validateForm() {
    const { formData } = this.state;
    let valid = true;

    
    Object.keys(formData).forEach( field => {
      if ( !this._validate(field, formData[field]) ){ valid = false; }
    });
    
    if (!valid) {
      this.setState({submitedDisabled: true})
    }

    return valid;
  }
  
  render() {

    const { displayError, formData, submitDisabled } = this.state;

    const errorMessages = {
      firstName: <p className="error-message">First name can't be blank</p>,
      lastName: <p className="error-message">Last name can't be blank</p>, 
      password: <p className="error-message">Your password needs to be at least 7 characters</p>,
      email: <><p className="error-message">That doesn't look right.</p> <strong>(We won't spam you.)</strong></>,
      terms: <p className="error-message">They're not optional, buddy</p>
    }

    const inputProps = { 
      displayError, 
      formData, 
      errorMessages,
      handleInput: this.handleInput,  
      validateInput: this.validateInput,  
    }

    const sessionErrors = this.props.sessionErrors.length ? 
      <div className="session-errors-container">
        <h2>Uh oh! Couldn't make that account for ya.</h2>
        There were problems with the following fields:
        <div className="session-errors">
          {this.props.sessionErrors}
        </div>
      </div> : null

    return (
      <section className='signup signup-form-container' >
        <div className="signup-div-left">
          <div className="signup-div-text">
            <h1>Presenter sign up</h1>



            <form onSubmit={this.submit} className="signup-form">

              {sessionErrors}

              <SignupInput type='text' field='firstName' text='First name' {...inputProps} />
              <SignupInput type='text' field='lastName' text='Last name' {...inputProps} />
              <SignupInput type='text' field='email' text='Email' {...inputProps} />
              <SignupInput type='password' field='password' text='Password' {...inputProps} />
              <SignupInput type='checkbox' field='terms' 
                text='Agree to the nonexistent Terms and Conditions' 
                id="terms-checkbox"
                {...inputProps} />

              {/* <input type="checkbox" onBlur={this.validateInput('terms')}/> */}

              <button 
                type='submit' 
                className={"button button-blue" + (submitDisabled ? " disabled": "") }
                disabled={submitDisabled}
              >Sign up </button>

            </form>

          </div>
        </div>
        <div className="signup-div-right">
          <AttributedImage
            id="signup-form-img"
            src={window.signupSplash02URL}
            alt={"Person Looking at Charts"}
            imgClass="signup-splash-img"
            iconClass="icon-dark"
          >
            <a href="https://stories.freepik.com/illustration/setup-analytics/rafiki#FF725EFF">Illustration vector created by stories - stories.freepik.com</a>
          </AttributedImage>
        </div>
      </section >
    )

    
  }
};

export default SignupForm;

