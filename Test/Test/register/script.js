$(document).ready(function () {
    const successModalEl = document.getElementById('successModal');
    const successModal = successModalEl ? new bootstrap.Modal(successModalEl) : null;

    // Register Form Handling
    if ($('#registerForm').length) {
        $('#registerForm').on('submit', function (e) {
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

            // Check at least one game is selected
            const gamesChecked = $('input[type="checkbox"][id^="game"]:checked').length;
            if (gamesChecked === 0) {
                alert('Please select at least one game you play.');
                return;
            }

            // Collect data (optional - for future use)
            const formData = {
                fullName: $('#fullName').val(),
                studentId: $('#studentId').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                faculty: $('#faculty').val(),
                year: $('#year').val(),
                games: [],
                discord: $('#discord').val(),
                reason: $('#reason').val()
            };

            $('input[type="checkbox"][id^="game"]:checked').each(function () {
                formData.games.push($(this).val());
            });

            console.log('Registration data:', formData);

            // Show success modal
            if (successModal) {
                successModal.show();
            }

            // Reset form
            form.reset();
            $(form).removeClass('was-validated');
        });
    }

    // Contact Form Handling
    if ($('#contactForm').length) {
        $('#contactForm').on('submit', function (e) {
            e.preventDefault();
            const form = this;

            // Show validation messages if blank
            $(form).addClass('was-validated');

            if (!form.checkValidity()) {
                // Focus first empty field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return;
            }

            // Success
            if (successModal) {
                successModal.show();
            }
            form.reset();
            $(form).removeClass('was-validated');
        });
    }
});
