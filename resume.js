// resume.js

// Function to parse the resume text and extract basic information
function parseResume(resumeText) {
    const parsedData = {
        name: null,
        email: null,
        phone: null,
        skills: []
    };

    // Split the resume text into lines
    const lines = resumeText.split('\n');

    // Extract name (assumed to be the first line)
    if (lines.length > 0) {
        parsedData.name = lines[0].trim();
    }

    // Extract email and phone using regex
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?\d{1,3}[- ]?)?\d{10}/; // Basic phone number format

    for (const line of lines) {
        const emailMatch = line.match(emailRegex);
        if (emailMatch) {
            parsedData.email = emailMatch[0];
        }

        const phoneMatch = line.match(phoneRegex);
        if (phoneMatch) {
            parsedData.phone = phoneMatch[0];
        }
    }

    // Extract skills (simple keyword matching)
    const skillKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL']; // Add more skills as needed
    for (const line of lines) {
        skillKeywords.forEach(skill => {
            if (line.toLowerCase().includes(skill.toLowerCase()) && !parsedData.skills.includes(skill)) {
                parsedData.skills.push(skill);
            }
        });
    }

    return parsedData;
}

// Function to match user skills against a job description
function matchSkills(jobDescription, userSkills) {
    // Extract words from job description
    const jobSkills = jobDescription.toLowerCase().match(/\b\w+\b/g) || [];
    
    // Convert user skills to lowercase for comparison
    const userSkillsLower = userSkills.map(skill => skill.toLowerCase());

    // Find missing skills
    const missingSkills = jobSkills.filter(skill => !userSkillsLower.includes(skill));

    return missingSkills;
}

// Function to assess ATS compatibility of a resume
function assessATSCompatibility(resumeText) {
    let score = 100; // Start with a perfect score

    // Define required section headings
    const requiredHeadings = ["Summary", "Experience", "Education", "Skills"];
    
    requiredHeadings.forEach(heading => {
        if (!resumeText.toLowerCase().includes(heading.toLowerCase())) {
            score -= 20; // Deduct points for each missing section heading
        }
    });

    return Math.max(0, score); // Ensure score is not negative
}

// Function to generate a resume summary using OpenAI API
async function generateResumeSummary(resumeText) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual OpenAI API key
    const apiUrl = 'https://api.openai.com/v1/completions';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo-instruct",
                prompt: `Write a concise summary for the following resume:\n\n${resumeText}`,
                max_tokens: 150,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (response.ok) {
            return data.choices[0].text.trim();
        } else {
            console.error('Error from OpenAI API:', data);
            return 'Failed to generate summary. Check console for details.';
        }
    } catch (error) {
        console.error('Network error:', error);
        return 'Network error occurred. Please check your connection and try again.';
    }
}

// Function to extract text from a PDF file using pdf.js
async function extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async function (event) {
            try {
                const typedarray = new Uint8Array(event.target.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = "";

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(" ");
                    fullText += pageText + "\n";
                }

                resolve(fullText);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = function (error) {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
}

// Function to handle file upload and parsing
async function handleFileUpload(file) {
    try {
        let resumeText = "";

        if (file.type === "application/pdf") {
            resumeText = await extractTextFromPDF(file);
        } else {
            // Handle non-PDF files (e.g., .txt)
            resumeText = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });
        }

        const parsedData = parseResume(resumeText);
        document.getElementById('parsed-output').textContent = JSON.stringify(parsedData, null, 2);

        const summary = await generateResumeSummary(resumeText);
        document.getElementById('ai-summary-output').textContent = `AI Generated Summary:\n${summary}`;

    } catch (error) {
        console.error("Error processing file:", error);
        alert("Error processing file. See console for details.");
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for file upload
    document.getElementById('parse-resume').addEventListener('click', function() {
        const fileInput = document.getElementById('resume-upload');
        
        if (fileInput.files.length > 0) {
            handleFileUpload(fileInput.files[0]);
        } else {
            alert('Please select a resume file to upload.');
        }
    });
});
