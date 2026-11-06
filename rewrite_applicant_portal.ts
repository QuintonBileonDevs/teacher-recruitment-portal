import fs from 'fs';

const filePath = './src/components/ApplicantPortal.tsx';
const fileContent = fs.readFileSync(filePath, 'utf-8');

const returnStatementIndex = fileContent.indexOf('  return (\n    <div className="w-full">');

if (returnStatementIndex !== -1) {
  const newReturn = `  return (
    <div className="w-full relative z-10 pt-4">
      {mode === 'welcome' && (
        <ApplicantWelcome 
          setMode={setMode} 
          trackSearchNum={trackSearchNum} 
          setTrackSearchNum={setTrackSearchNum} 
          handleTrackSearch={handleTrackSearch} 
          trackError={trackError} 
        />
      )}
      
      {mode === 'register' && (
        <ApplicantRegister 
          setMode={setMode} 
          formStep={formStep} 
          handleNextStep={handleNextStep} 
          handlePrevStep={handlePrevStep} 
          handleSubmit={handleSubmit}
          fullName={fullName} setFullName={setFullName}
          omangNumber={omangNumber} setOmangNumber={setOmangNumber}
          phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
          email={email} setEmail={setEmail}
          vacancySubject={vacancySubject} setVacancySubject={setVacancySubject}
          highestQualification={highestQualification} setHighestQualification={setHighestQualification}
          experienceYears={experienceYears} setExperienceYears={setExperienceYears}
          preferredRegion={preferredRegion} setPreferredRegion={setPreferredRegion}
          files={files} uploadProgress={uploadProgress} 
          formErrors={formErrors} handleSimulatedUpload={handleSimulatedUpload}
        />
      )}

      {mode === 'track' && (
        <ApplicantTrack 
          setMode={setMode} 
          setTrackSearchNum={setTrackSearchNum}
          activeTrackOmang={activeTrackOmang}
          activeTrackedApplicant={activeTrackedApplicant}
          handleToggleAvailability={handleToggleAvailability}
          handleAcceptOffer={handleAcceptOffer}
          handleDeclineOffer={handleDeclineOffer}
        />
      )}
    </div>
  );
}`;

  const replacementContent = fileContent.substring(0, returnStatementIndex) + newReturn;
  fs.writeFileSync(filePath, replacementContent, 'utf-8');
  console.log('Successfully updated ApplicantPortal.tsx');
} else {
  console.error('Could not find the return statement in ApplicantPortal.tsx');
}
