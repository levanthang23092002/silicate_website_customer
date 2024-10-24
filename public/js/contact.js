 
document.getElementById('contactForm').addEventListener('submit', function() {
    var form = this;
    const data = [ form.name.value, form.email.value, form.message.value, form.subject.value];

    fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Email sent successfully!');
            window.location.href = "/login";
            
        } else {
            alert('Failed to send email.');
        }
    });
    });