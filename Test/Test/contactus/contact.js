$(document).ready(function () {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));

    $('#contactForm').on('submit', function (e) {
        e.preventDefault();
        const form = this;

        // Show Bootstrap validation styles
        $(form).addClass('was-validated');

        // Check if form is valid
        if (!form.checkValidity()) {
            // Focus on the first invalid field
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }

        // Show success modal
        successModal.show();

        // Reset form
        form.reset();
        $(form).removeClass('was-validated');
    });
});
