var formElement=document.forms.INFO;
formElement.onsubmit=validateInfoForm;

function validateInfoForm() {
    
    var namesElement=formElement.elements.names;
    var emailElement=formElement.elements.email;
    var messageElement=formElement.elements.message;

    var nameValue=namesElement.value;
    var emailValue=emailElement.value;
    var messageValue=messageElement.value;

    if ( nameValue.length>20 ) {
        alert('Введите пожалуйста имя не длиннее 20 символов!');
        namesElement.focus();
        return false;
    }

    if ( nameValue.length==0 ) {
        alert('Введите пожалуйста имя!');
        namesElement.focus();
        return false;
    }

    if ( messageValue.length>50 ) {
        alert('Введите пожалуйста текст не длиннее 50 символов!');
        messageElement.focus();
        return false;
    }

    if ( emailValue.length==0 ) {
        alert('Введите пожалуйста Email');
        emailElement.focus();
        return false;
    }

        

    return true;
}