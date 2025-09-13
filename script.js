
    // Utility Functions
    function getGradePoints(marks) {
      if (marks >= 85) return 4.0;
      else if (marks >= 80) return 3.7;
      else if (marks >= 75) return 3.3;
      else if (marks >= 70) return 3.0;
      else if (marks >= 65) return 2.7;
      else if (marks >= 61) return 2.3;
      else if (marks >= 58) return 2.0;
      else if (marks >= 55) return 1.7;
      else if (marks >= 50) return 1.0;
      else return 0.0;
    }

    function getGrade(gpa) {
      if (gpa >= 3.7) return 'A';
      else if (gpa >= 3.3) return 'A-';
      else if (gpa >= 3.0) return 'B+';
      else if (gpa >= 2.7) return 'B';
      else if (gpa >= 2.3) return 'B-';
      else if (gpa >= 2.0) return 'C+';
      else if (gpa >= 1.7) return 'C';
      else if (gpa >= 1.0) return 'D';
      else return 'F';
    }

    // Theme Management
    class ThemeManager {
      constructor() {
        this.currentTheme = 'chalkboard';
        this.init();
      }

      init() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
          btn.addEventListener('click', () => this.switchTheme(btn.dataset.theme));
        });
      }

      switchTheme(theme) {
        // Remove all theme classes
        document.body.classList.remove(
          'theme-modern', 'theme-90s', 'theme-notebook', 'theme-neon',
          'theme-aesthetic', 'theme-cat', 'theme-ocean', 'theme-forest',
          'theme-space', 'theme-sunset', 'theme-dark'
        );
        
        // Add new theme class
        if (theme !== 'chalkboard') {
          document.body.classList.add(`theme-${theme}`);
        }

        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
          btn.classList.remove('active');
          if (btn.dataset.theme === theme) {
            btn.classList.add('active');
          }
        });

        this.currentTheme = theme;
      }
    }

    // Calculator Management
    class Calculator {
      constructor() {
        this.currentTab = 'gpa';
        this.subjects = [];
        this.semesters = [];
        this.init();
      }

      init() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
          tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // GPA Calculator
        document.getElementById('generate-subjects').addEventListener('click', () => this.generateSubjects());
        document.getElementById('calculate-gpa').addEventListener('click', () => this.calculateGPA());

        // CGPA Calculator
        document.getElementById('generate-semesters').addEventListener('click', () => this.generateSemesters());
        document.getElementById('calculate-cgpa').addEventListener('click', () => this.calculateCGPA());

        // Action buttons
        document.getElementById('copy-result').addEventListener('click', () => this.copyResult());
        document.getElementById('export-result').addEventListener('click', () => this.exportResult());
        document.getElementById('reset-all').addEventListener('click', () => this.resetAll());

        // Live calculation
        document.addEventListener('input', (e) => {
          if (e.target.matches('.subject-marks, .subject-credits, .semester-gpa, .semester-credits')) {
            this.updateLiveCalculation();
          }
        });
      }

      switchTab(tab) {
        // Update tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tab}-content`).classList.add('active');

        // Update result label
        document.getElementById('result-label').textContent = tab.toUpperCase();
        document.getElementById('credits-label').textContent = tab === 'gpa' ? 'Credits' : 'Semesters';

        this.currentTab = tab;
        this.updateLiveCalculation();
      }

      generateSubjects() {
        const count = parseInt(document.getElementById('subject-count').value);
        if (!count || count < 1 || count > 15) {
          alert('Please enter a valid number of subjects (1-15)');
          return;
        }

        const container = document.getElementById('subjects-container');
        container.innerHTML = '';

        for (let i = 0; i < count; i++) {
          const subjectRow = document.createElement('div');
          subjectRow.className = 'subject-row';
          subjectRow.innerHTML = `
            <div class="form-group">
              <label class="form-label">Subject ${i + 1}</label>
              <input type="text" class="form-input" placeholder="Subject name (optional)">
            </div>
            <div class="form-group">
              <label class="form-label">Marks (%)</label>
              <input type="number" class="form-input subject-marks" min="0" max="100" step="0.1" placeholder="85">
            </div>
            <div class="form-group">
              <label class="form-label">Credit Hours</label>
              <input type="number" class="form-input subject-credits" min="0.5" max="10" step="0.5" placeholder="3">
            </div>
          `;
          container.appendChild(subjectRow);
        }

        document.getElementById('calculate-gpa').style.display = 'block';
      }

      generateSemesters() {
        const count = parseInt(document.getElementById('semester-count').value);
        if (!count || count < 1 || count > 8) {
          alert('Please enter a valid number of semesters (1-8)');
          return;
        }

        const container = document.getElementById('semesters-container');
        container.innerHTML = '';

        for (let i = 0; i < count; i++) {
          const semesterRow = document.createElement('div');
          semesterRow.className = 'semester-row';
          semesterRow.innerHTML = `
            <div class="form-group">
              <label class="form-label">Semester ${i + 1} GPA</label>
              <input type="number" class="form-input semester-gpa" min="0" max="4" step="0.01" placeholder="3.50">
            </div>
            <div class="form-group">
              <label class="form-label">Credit Hours</label>
              <input type="number" class="form-input semester-credits" min="1" max="30" step="0.5" placeholder="18">
            </div>
            <div></div>
          `;
          container.appendChild(semesterRow);
        }

        document.getElementById('calculate-cgpa').style.display = 'block';
      }

      calculateGPA() {
        const subjects = document.querySelectorAll('#subjects-container .subject-row');
        let totalPoints = 0;
        let totalCredits = 0;
        let validSubjects = 0;

        subjects.forEach(subject => {
          const marks = parseFloat(subject.querySelector('.subject-marks').value);
          const credits = parseFloat(subject.querySelector('.subject-credits').value);

          if (!isNaN(marks) && !isNaN(credits) && marks >= 0 && marks <= 100 && credits > 0) {
            totalPoints += getGradePoints(marks) * credits;
            totalCredits += credits;
            validSubjects++;
          }
        });

        if (validSubjects === 0) {
          alert('Please enter valid marks and credit hours for at least one subject');
          return;
        }

        const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
        this.updateResults(gpa, totalCredits, validSubjects);
        this.showSuccessMessage(`GPA calculated successfully! Your GPA is ${gpa.toFixed(2)} (${getGrade(gpa)})`);
      }

      calculateCGPA() {
        const semesters = document.querySelectorAll('#semesters-container .semester-row');
        let totalPoints = 0;
        let totalCredits = 0;
        let validSemesters = 0;

        semesters.forEach(semester => {
          const gpa = parseFloat(semester.querySelector('.semester-gpa').value);
          const credits = parseFloat(semester.querySelector('.semester-credits').value);

          if (!isNaN(gpa) && !isNaN(credits) && gpa >= 0 && gpa <= 4 && credits > 0) {
            totalPoints += gpa * credits;
            totalCredits += credits;
            validSemesters++;
          }
        });

        if (validSemesters === 0) {
          alert('Please enter valid GPA and credit hours for at least one semester');
          return;
        }

        const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
        this.updateResults(cgpa, totalCredits, validSemesters);
        this.showSuccessMessage(`CGPA calculated successfully! Your CGPA is ${cgpa.toFixed(2)} (${getGrade(cgpa)})`);
      }

      updateLiveCalculation() {
        if (this.currentTab === 'gpa') {
          const subjects = document.querySelectorAll('#subjects-container .subject-row');
          let totalPoints = 0;
          let totalCredits = 0;

          subjects.forEach(subject => {
            const marksInput = subject.querySelector('.subject-marks');
            const creditsInput = subject.querySelector('.subject-credits');
            
            if (marksInput && creditsInput) {
              const marks = parseFloat(marksInput.value);
              const credits = parseFloat(creditsInput.value);

              if (!isNaN(marks) && !isNaN(credits) && marks >= 0 && marks <= 100 && credits > 0) {
                totalPoints += getGradePoints(marks) * credits;
                totalCredits += credits;
              }
            }
          });

          const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
          this.updateResults(gpa, totalCredits, subjects.length);
        } else {
          const semesters = document.querySelectorAll('#semesters-container .semester-row');
          let totalPoints = 0;
          let totalCredits = 0;

          semesters.forEach(semester => {
            const gpaInput = semester.querySelector('.semester-gpa');
            const creditsInput = semester.querySelector('.semester-credits');
            
            if (gpaInput && creditsInput) {
              const gpa = parseFloat(gpaInput.value);
              const credits = parseFloat(creditsInput.value);

              if (!isNaN(gpa) && !isNaN(credits) && gpa >= 0 && gpa <= 4 && credits > 0) {
                totalPoints += gpa * credits;
                totalCredits += credits;
              }
            }
          });

          const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
          this.updateResults(cgpa, totalCredits, semesters.length);
        }
      }

      updateResults(value, credits, count) {
        // Update main result
        document.getElementById('result-value').textContent = value.toFixed(2);
        document.getElementById('current-value').textContent = value.toFixed(2);
        
        // Update stats
        document.getElementById('total-credits').textContent = this.currentTab === 'gpa' ? credits.toFixed(1) : count;
        document.getElementById('grade-value').textContent = getGrade(value);

        // Update progress circle
        this.updateProgressCircle(value);
      }

      updateProgressCircle(value) {
        const circle = document.querySelector('.circle-fill');
        const circumference = 2 * Math.PI * 56;
        const progress = (value / 4) * circumference;
        const offset = circumference - progress;
        
        circle.style.strokeDashoffset = offset;
      }

      showSuccessMessage(message) {
        // Create a temporary success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
          padding: 15px 20px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
          z-index: 1000;
          font-weight: 600;
          max-width: 300px;
          animation: slideIn 0.5s ease-out;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          successDiv.style.animation = 'slideOut 0.5s ease-in forwards';
          setTimeout(() => document.body.removeChild(successDiv), 500);
        }, 3000);
      }

      copyResult() {
        const value = document.getElementById('result-value').textContent;
        const grade = document.getElementById('grade-value').textContent;
        const type = this.currentTab.toUpperCase();
        
        const text = `My ${type}: ${value} (Grade: ${grade})`;
        
        navigator.clipboard.writeText(text).then(() => {
          this.showSuccessMessage('Result copied to clipboard!');
        }).catch(() => {
          this.showSuccessMessage('Failed to copy result');
        });
      }

      exportResult() {
        const value = document.getElementById('result-value').textContent;
        const grade = document.getElementById('grade-value').textContent;
        const credits = document.getElementById('total-credits').textContent;
        const type = this.currentTab.toUpperCase();
        
        const content = `
GPA/CGPA Calculator Result
=========================

${type}: ${value}
Grade: ${grade}
${this.currentTab === 'gpa' ? 'Total Credits' : 'Semesters'}: ${credits}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Generated by PUCIT ${type} Calculator
© 2025 Mutahhar Bhutta
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_Report_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage('Report exported successfully!');
      }

      resetAll() {
        if (confirm('Are you sure you want to reset all data?')) {
          document.getElementById('subject-count').value = '';
          document.getElementById('semester-count').value = '';
          document.getElementById('subjects-container').innerHTML = '';
          document.getElementById('semesters-container').innerHTML = '';
          document.getElementById('calculate-gpa').style.display = 'none';
          document.getElementById('calculate-cgpa').style.display = 'none';
          
          this.updateResults(0, 0, 0);
          this.showSuccessMessage('All data has been reset');
        }
      }
    }

    // Initialize the application
    let themeManager, calculator;

    document.addEventListener('DOMContentLoaded', () => {
      themeManager = new ThemeManager();
      calculator = new Calculator();
      
      // Add CSS animations for success messages
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `;
      document.head.appendChild(style);
    });