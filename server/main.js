import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  // console.log('Server started up.')
  import '../imports/api/experiments.js';
  import '../imports/api/raw-fastq-records.js';
  import '../imports/api/sequencers.js';
});
