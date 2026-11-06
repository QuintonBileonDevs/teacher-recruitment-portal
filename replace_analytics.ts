import fs from 'fs';

const filePath = './src/components/AdminPortal.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const analyticsStart = content.indexOf(`      {activeTab === 'analytics' && (`);
const bottomDrawerStart = content.indexOf(`      {/* Bottom Panel Drawer / Auditor workspace details */}`);

if (analyticsStart !== -1 && bottomDrawerStart !== -1) {
  const replacement = `      {activeTab === 'analytics' && (
        <AdminAnalytics 
          REGIONAL_VACANCY_DATA={REGIONAL_VACANCY_DATA} 
          QUALIFICATION_DISTRIBUTION={QUALIFICATION_DISTRIBUTION} 
          TURNAROUND_TIME_TREND={TURNAROUND_TIME_TREND} 
          BUDGET_BREAKDOWN_DATA={BUDGET_BREAKDOWN_DATA} 
        />
      )}

`;
  const newContent = content.substring(0, analyticsStart) + replacement + content.substring(bottomDrawerStart);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log("Successfully replaced analytics block inline.");
} else {
  console.error("Could not find delimiters.");
}
