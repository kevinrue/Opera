import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Experiments = new Mongo.Collection('experiments');

const validTypes = [
  'RNA-seq',
  'ChIP-seq'
];

const validOrganisms = [
  'Homo sapiens',
];

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish experiments to users that are logged in
  Meteor.publish('experiments', function publishExperiments() {
  	return (this.userId ? Experiments.find() : []);
  })
}

function countIdInDB(text) {
  return (
    Experiments.find(
      {
        id: text,
      }
    ).count()
  );
}

function countTitleInDB(text) {
  return (
    Experiments.find(
      {
        title: text,
      }
    ).count()
  );
}

Meteor.methods({
  'experiments.clear'() {
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
 
    Experiments.remove({});
  },

  'experiments.insertBatch'(dataLines) {
    check(dataLines, Array);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let recordIds = dataLines.map((inputLine, lineIndex) => {
      inputFields = inputLine.split('\t');
      if (inputFields.length != 7){
        throw new Meteor.Error('invalid-input',
          'At line ' + (lineIndex + 1) + ': Expected 7 fields, found: ' + inputFields.length
        );
      }
      newId = inputFields[0];
      newTitle = inputFields[1];
      newType = inputFields[2];
      newOrganism = inputFields[3];
      newContact = inputFields[4];
      newDescription = inputFields[5];
      newNotes = inputFields[6];
      // Public ID
      if (newId === '') {
        throw new Meteor.Error('invalid-input',
          'At line ' + (lineIndex + 1) + ': Experiment ID cannot be empty');
      }
      if (countIdInDB(newId) > 0) {
        throw new Meteor.Error('invalid-input',
          'At line ' + (lineIndex + 1) + ': Experiment ID already exist in database: ' + newId);
      }
      // Title
      if (newTitle === '') {
        throw new Meteor.Error('invalid-input',
          'Experiment title cannot be empty');
      }
      if (countTitleInDB(newTitle) > 0) {
        throw new Meteor.Error('invalid-input',
          'At line ' + (lineIndex + 1) + ': Experiment title already exist in database: ' + newTitle);
      }
      // Type
      if(validTypes.indexOf(newType) === -1){
        throw new Meteor.Error('invalid-input',
          'At line ' + (lineIndex + 1) + ': Experiment type not supported (yet): ' + newType);
      }
      // Organism
      if(validOrganisms.indexOf(newOrganism) === -1){
        throw new Meteor.Error('invalid-input',
          'At line ' + (lineIndex + 1) + ': Organism not supported (yet): ' + newOrganism);
      }
      let newExperiment = {
        id: newId,
        title: newTitle,
        type: newType,
        organism: newOrganism,
        contact: newContact,
        description: newDescription,
        notes: newNotes,
      };
      return (
        Experiments.insert(newExperiment)
      );
    });

    // console.log('newExperimentId: ' + recordIds)
    // return the array of new identifiers
    return(recordIds);
  },

  'experiments.insert'(id, title, type, organism, contact, description, notes) {
    check(id, String);
    check(title, String);
    check(type, String);
    check(organism, String);
    check(contact, String);
    check(description, String);
    check(notes, String);
 
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    let newValues = {
      id: id,
      title: title,
      type: type,
      organism: organism,
      contact: contact,
      description: description,
      notes: notes,
    };

    let recordId = Experiments.insert(
      newValues,
      (err, res) => {
        // console.log('experiments.insert connection: ' + this.connection);
        // On success, log the event
        if (!err){
          console.log('experiments.insert: success');
          // Meteor.call(
          //   'databaseEvents.insert',
          //   this.userId,
          //   'c', // 'create'
          //   Array(res),
          //   'rawFastqs',
          //   newValues: newValues,
          // );
        }
      }
    )

    console.log('newExperimentId: ' + recordId)
 
    return(recordId);
  },

  // 'experiments.remove'(experimentId) {
  //   check(experimentId, String);
 
  //   Experiments.remove(experimentId);
  // },

});