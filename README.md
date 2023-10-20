# Vocabulary Trainer

![Build & Publish app](https://github.com/Raphael-Stellwag/Vocabulary-Trainer/workflows/Build%20&%20Publish%20app/badge.svg)  
Live version is accessable under [https://vokabel-trainer-9e341.web.app/#/](https://vokabel-trainer-9e341.web.app/#/)

## Debugging 

 - ng serve --host 0.0.0.0
  
Debugging ios device on windows: https://github.com/google/ios-webkit-debug-proxy

## Deploy via ng deploy to firebase

 - ng build --prod
 - ng deploy

## Deploy via github CI (to 000webhost) (OLD)

 - push your changes to github (main branch)
 - a ci job will be started and your changes will be available after around 5 mins (sometimes doesnt work because of bad ftp server)

## Deploy manually (OLD)
  
- npm version patch
- ng build --prod  
- Zip the dist folder  
- Upload it to 000webhost
  
## Installed Frameworks
  
- ng add @angular/pwa  
- ng add @angular/material
- Google Fonts see src/index.html
- jsstore: npm install jsstore --save
  
## Todos
  
- (check) adding login / signup page for sync over serveral devices
- (check) Export Unit / class
- (doing at the moment) adding sync functionality
    - including the import functionality
- Refactoring
- (optional) turning app to an angular universal app
  
## The sync process
  
### Definition of Action

An Action in the context of this project is a modify operation (Insert, Update or Delete) forced by the user on a device. This action then must be synced through the several devices the user may have.

### Workflow
  
1. We get the server Actions from the Rest Service (just the actions since the last sync --> so just the actions from other devices)
2. We undo the local Actions (newest to oldest)
3. We perform the server Actions
4. For Version 2: Performance Improvements --> we perform not all actions (e.g. 2 Update Actions on 1 Vocabulary --> just the 2. Update is done, the first is discarded)
5. We redo the local Actions (maybe not all actions can be done, e.g. the server Action deleted a Vocabulary. After this an update of course not works anymore. These actions are discarded)
6. We publish the local Actions to the server  
   
### Challenges & Rules
  
1. Through the server Actions, the deleted and then readded Vocabularies (local Actions with the method "ADD") will have another Id after the insert --> if afterwards an update on this vocabulary is done, the id there must also be changed, that the action is performed on the correct Vocabulary.
2. Through the server Actions, a vocabulary could be deleted --> The Update must be discarded
3. ...
  
### Defined Test Cases
  
| Id | Requirements | Test Case | Expected Output | Current Output | Result | 
|----|--------------|-----------|-----------------|----------------|--------|
| 1  | no actions on server; no vocabularies on device; device not synced | add Vocabulary; sync device | Action should be synced to the server | Action is synced to the server | ✓ |
| 2  | no actions on server; no vocabularies on device; device not synced | add Vocabulary; update vocabulary; sync device | 2 Actions (ADD, UPDATE) should be synced to the server | 2 Actions (ADD, UPDATE) are synced to the server | ✓ |
| 3  | no actions on server; no vocabularies on device; device not synced | add Vocabulary; delete vocabulary; sync device | 2 Actions (ADD, DELETE) should be synced to the server | 2 Actions are synced to the server | ✓ |
| 4  | Situation after Test Case 2 | add Vocabulary | 1 Action (ADD) should be synced to the server | 1 Action (ADD) is synced to the server | ✓ |
| 5  | Situation after Test Case 2 | update vocabulary | 1 Action (UPDATE) should be synced to the server | 1 Action (UPDATE) is synced to the server | ✓ |
| 6  | Situation after Test Case 2 | delete vocabulary | 1 Action (DELETE) should be synced to the server | 1 Action is synced to the server | ✓ |
| 7 | 2 actions on server (ADD, UPDATE), the first action is already synced with the device | add vocabulary | the update from the server should be done and then the new vocabulary be added; on the server should be 3 actions at the end | | ❌ |
| 8 | 2 actions on server (ADD, UPDATE), the first action is already synced with the device | update vocabulary | the update from the server should be done and then the vocabulary should be edited the second time; on the server should be 3 actions at the end | | ❌ |
| 9 | 2 actions on server (ADD, UPDATE), the first action is already synced with the device | delete vocabulary | the update from the server should be done and then the vocabulary should be deleted --> no vocabulary at the end on the device; on the server should be 3 actions at the end | | ❌ |
| 10 | 2 actions on server (ADD, ADD), the first action is already synced with the device | add vocabulary | the add from the server should be done (with same id than on server) and then should be the local add be done (with new id); on the server should be 3 actions at the end | | ❌ |
| 10 | 2 actions on server (ADD, ADD), the first action is already synced with the device | add vocabulary + update added vocabulary | the add from the server should be done (with same id than on server) and then should be the local add be done (with new id); the id in the update action must be changed on the third add and then be done; on the server should be 4 actions at the end | | ❌ | 
| 11 | 2 actions on server (ADD, ADD), the first action is already synced with the device | add vocabulary + delete added vocabulary | the add from the server should be done (with same id than on server) and then should be the local add be done (with new id); the id in the delete action must be changed so that the third vocabulary is be deleted; on the server should be 4 actions at the end OR the 2 actions should be discarded (so dont readd the voc and then delete it) | | ❌ |  
| 12 | no actions on server, device is synced| import vocabularies | All the actions should be at the end synced to the server (Test over 2nd device, synced, no vocabularies at the beginning) | | ❌ | 
| 13 | | | | // 30 mixed actions on the server, device not synced, 10 local actions (ADD, UPDATE, DELETE) / sync device / the vocabularies from the other device should be now also on the new device + the additional vocabularies from the local actions; on the server should be 40 actions
| 13 | | | | // import a bunch of vocabularies

  
