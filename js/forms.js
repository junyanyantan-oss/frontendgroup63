(() => {
    'use strict';

    function saveBrowserData(key, value) {
        const serializedValue = JSON.stringify(value);
        try { localStorage.setItem(key, serializedValue); } catch (error) { console.warn(`Could not save ${key}.`, error); }
        try {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 7);
            document.cookie = `${key}=${encodeURIComponent(serializedValue)};expires=${expiryDate.toUTCString()};path=/;SameSite=Lax`;
        } catch (error) { console.warn(`Could not save ${key} as a cookie.`, error); }
    }

    function loadBrowserData(key) {
        try {
            const savedValue = localStorage.getItem(key);
            if (savedValue) return JSON.parse(savedValue);
        } catch (error) { console.warn(`Could not load ${key}.`, error); }

        try {
            const prefix = `${key}=`;
            const cookie = document.cookie.split(';').map(item => item.trim()).find(item => item.startsWith(prefix));
            return cookie ? JSON.parse(decodeURIComponent(cookie.slice(prefix.length))) : null;
        } catch (error) { return null; }
    }

    function focusFirstInvalidField(form) {
        const firstInvalidField = form.querySelector(':invalid');
        if (firstInvalidField) firstInvalidField.focus();
    }

    $(function () {
        const successModalElement = document.getElementById('successModal');
        const successModal = successModalElement ? new bootstrap.Modal(successModalElement) : null;
        const savedFeedback = loadBrowserData('utar_feedback');

        if (savedFeedback && $('#contactForm').length) {
            $('#contactName').val(savedFeedback.name || '');
            $('#contactEmail').val(savedFeedback.email || '');
            $('#contactForm').before(`
                <div class="alert alert-info alert-dismissible fade show bg-dark border-warning text-light mb-4" role="alert">
                    <div class="d-flex align-items-center">
                        <i class="fa-solid fa-database text-warning fs-4 me-3"></i>
                        <div><strong>Saved locally:</strong> Welcome back, <span class="saved-feedback-name text-warning"></span>. Your previous feedback is still available in this browser.</div>
                    </div>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`);
            $('.saved-feedback-name').text(savedFeedback.name || 'member');
        }

        $('#registerForm').on('submit', function (event) {
            event.preventDefault();
            const form = this;
            $(form).addClass('was-validated');
            if (!form.checkValidity()) { focusFirstInvalidField(form); return; }

            const selectedGames = $('input[type="checkbox"][id^="game"]:checked').map(function () { return $(this).val(); }).get();
            if (selectedGames.length === 0) { alert('Please select at least one game you play.'); return; }

            saveBrowserData('utar_member', {
                fullName: $('#fullName').val().trim(),
                studentId: $('#studentId').val().trim().toUpperCase(),
                email: $('#email').val().trim(),
                phone: $('#phone').val().trim(),
                faculty: $('#faculty').val(),
                year: $('#year').val(),
                games: selectedGames,
                discord: $('#discord').val().trim(),
                reason: $('#reason').val().trim(),
                submittedAt: new Date().toISOString()
            });

            if (successModal) successModal.show();
            form.reset();
            $(form).removeClass('was-validated');
        });

        $('#contactForm').on('submit', function (event) {
            event.preventDefault();
            const form = this;
            $(form).addClass('was-validated');
            if (!form.checkValidity()) { focusFirstInvalidField(form); return; }

            const feedback = {
                name: $('#contactName').val().trim(),
                email: $('#contactEmail').val().trim(),
                subject: $('#contactSubject').val(),
                message: $('#contactMessage').val().trim(),
                submittedAt: new Date().toISOString()
            };

            saveBrowserData('utar_feedback', feedback);
            $('#savedName').text(feedback.name);
            $('#savedEmail').text(feedback.email);
            $('#savedSubject').text(feedback.subject);
            $('#savedMessage').text(feedback.message);
            $('#savedTime').text(new Date(feedback.submittedAt).toLocaleString());
            $('#feedbackSummaryBox').show();
            if (successModal) successModal.show();
            form.reset();
            $(form).removeClass('was-validated');
        });
    });
})();
