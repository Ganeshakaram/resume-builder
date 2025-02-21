document.getElementById('parse-resume').addEventListener('click', function() {
    const fileInput = document.getElementById('resume-upload');
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

        if (allowedTypes.includes(file.type)) {
            handleFileUpload(file);
        } else {
            alert('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
        }
    } else {
        alert('Please select a resume file to upload.');
    }
});