// Function to load content asynchronously from a given URL
async function loadContent(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        document.getElementById('content').innerHTML = data;
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Function to submit a form using AJAX
function SubmitForm(formId) {
    // Prevent the default form submission
    event.preventDefault();

    // AJAX request
    $.ajax({
        url: $(`#${formId}`).attr('action'),
        type: 'POST',
        data: $(`#${formId}`).serialize(), // Serialize the form data
        success: function (response) {
            // Update the 'content' container with the received message
            $('#content').text(response.msg);
        },
    });
}

// Async function to submit a form with additional password validation
async function submitForm(formId) {
    // Get password-related input values
    const oldPassword = document.getElementById('OldPassword').value;
    const newPassword = document.getElementById('NewPassword').value;
    const reEnteredPassword = document.getElementById('ReEnteredPassword').value;

    // Check if new passwords match
    if (newPassword !== reEnteredPassword) {
        document.getElementById('errorMessage').innerText = 'New passwords do not match';
        return;
    }

    // Prevent the default form submission
    event.preventDefault();

    // AJAX request
    $.ajax({
        url: $(`#${formId}`).attr('action'),
        type: 'POST',
        data: $(`#${formId}`).serialize(), // Serialize the form data
        success: function (response) {
            // Update the 'content' container with the received message
            $('#content').text(response.msg);
        },
    });
}

// Function to set up password strength checking
async function setupPasswordStrength() {
    let password = document.getElementById('NewPassword');
    let strengthBadge = document.getElementById('strength');
    let submitBtn = document.getElementById('submitBtn');
    let signupForm = document.getElementById('updatePasswordForm');
    let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{4,})');

    // Function to check password strength and update UI
    function StrengthChecker(PasswordParameter) {
        if (strongPassword.test(PasswordParameter)) {
            strengthBadge.innerHTML = 'Strong Password &#10004;';
            strengthBadge.style.color = 'azure';
            submitBtn.disabled = false;
            submitBtn.style.cursor = 'pointer';
        } else {
            strengthBadge.innerHTML = 'Weak Password &#10006;';
            strengthBadge.style.textAlign = 'right'
            strengthBadge.style.color = 'azure';
            submitBtn.disabled = true;
            submitBtn.style.cursor = 'no-drop';
        }
    }

    // Event listener for password input
    password.addEventListener('input', () => {
        if (password.value.length !== 0) {
            strengthBadge.style.display = 'block';
            strengthBadge.style.textAlign = 'left';
            StrengthChecker(password.value);
        } else {
            strengthBadge.style.display = 'none';
            submitBtn.disabled = true;
        }
    });
}
