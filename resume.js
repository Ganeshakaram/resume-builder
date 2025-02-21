

async function getAIBulletPoints(experience) {
    const response = await fetch('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', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY' // Include your API key here
        },
        body: JSON.stringify({
            prompt: `Generate bullet points for experience in ${experience}`,
            max_tokens: 50,
        })
    });
 
    const data = await response.json();
    return data.choices[0].text.split('\n'); // Adjust based on your API response structure
 }
 
 function generateBulletPoints() {
     const experienceInput = document.getElementById('experience-input').value;
     
     // Simulated AI bullet point generation
     const bulletPoints =  getAIBulletPoints(experienceInput);
 
     // Display generated bullet points
     const outputDiv = document.getElementById('bullet-points-output');
     outputDiv.innerHTML = '<strong>Generated Bullet Points:</strong><ul>' + bulletPoints.map(point => `<li>${point}</li>`).join('') + '</ul>';
 }
 
 document.getElementById('resume-form').addEventListener('submit', function(event) {
     event.preventDefault();
 
     // Get form values
     const name = document.getElementById('name').value;
     const email = document.getElementById('email').value;
     const phone = document.getElementById('phone').value;
     const education = document.getElementById('education').value;
 
     // Generate resume content
     const resumeContent = `
         <h2>${name}</h2>
         <p>Email: ${email} | Phone: ${phone}</p>
         <h3>Education</h3><p>${education}</p>
         `;
 
     // Display resume
     document.getElementById('resume-preview').innerHTML = resumeContent;
 
     // Calculate a simple score (for demonstration)
     calculateResumeScore(resumeContent);
 });
 
 function calculateResumeScore(resumeContent) {
    // Simple scoring logic based on length of resume content
    let score = Math.min(resumeContent.length / 10, 100); // Score out of 100 based on length
    document.getElementById('resume-score').innerText = Math.round(score);
 }
 