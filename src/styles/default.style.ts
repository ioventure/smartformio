export const DEFAULT_STYLE = `
    body {
        margin: 0;
    }

    .form-container {
        margin-top: 20px;
    }

    :host {
        display: block;
        font-family: Arial, sans-serif;
    }

    form {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 600px; /* Increased max-width for better group visibility */
        margin: auto;
    }

    input[type='text'],
    input[type='email'],
    input[type='password'],
    input[type='number'],
    input[type='tel'],
    input[type='url'],
    input[type='date'],
    input[type='time'],
    input[type='datetime-local'],
    input[type='month'],
    input[type='week'],
    input[type='search'],
    input[type='color'],
    select,
    textarea {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 2px solid #dcdcdc;
        border-radius: 5px;
        font-size: 16px;
        color: #333;
        box-sizing: border-box;
    }

    input:focus,
    select:focus,
    textarea:focus {
        border-color: #9c27b0;
        outline: none;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #7b1fa2;
    }

    .checkbox-group,
    .radio-group,
    .remember-me {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .checkbox-group input[type='checkbox'],
    .radio-group input[type='radio'],
    .remember-me input[type='checkbox'] {
        margin-right: 10px;
    }

    .checkbox-group label,
    .radio-group label,
    .remember-me label {
        margin: 0;
        font-size: 14px;
        color: #555;
    }

    .form-group {
        border: 1px solid #dcdcdc;
        border-radius: 5px;
        padding: 15px;
        margin-bottom: 20px;
        background-color: #f9f9f9;
    }

    .form-group .group-title {
        font-size: 18px;
        font-weight: bold;
        color: #7b1fa2;
        margin-bottom: 10px;
    }

    .error-message {
        color: red;
        border-radius: 4px;
        font-size: 14px;
        margin: 0 0 20px 0;
    }

    button[type='submit'],
    button {
        width: 100%;
        padding: 10px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        color: white;
        margin-bottom: 10px;
        background-color: #7b1fa2;
    }

    button:hover {
        background-color: #6a1b9a;
    }

    button:disabled {
        background-color: #e0e0e0;
        color: #a0a0a0;
        cursor: not-allowed;
        opacity: 0.65;
        border: 1px solid #d0d0d0;
    }

    .image {
        width: 440px;
        height: 200px;
        margin: 0 auto;
        display: flex;
    }

    .preview-container {
        margin-top: 10px;
    }

    .file-preview {
        max-width: 100%;
        max-height: 200px;
        object-fit: cover;
    }

`;
