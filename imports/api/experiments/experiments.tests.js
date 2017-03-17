/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
 
import { Experiments } from './experiments.js';
 
if (Meteor.isServer) {
  describe('Experiments', () => {
    describe('methods', () => {
    	const userId = Random.id();
		let taskId;

		beforeEach(() => {
			Experiments.remove({});
			experimentId = Experiments.insert({
			  name: 'test experiment',
			  Nsamples: 0,
			});
		});

      it('can delete experiments', () => {
      	// Find the internal implementation of the experiment method so we can
        // test it in isolation
        const deleteExperiment = Meteor.server.method_handlers['experiments.remove'];
 
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId }; // Note: short for {userId: userId}
 
        // Run the method with `this` set to the fake invocation
        deleteExperiment.apply(invocation, [experimentId]);
 
        // Verify that the method does what we expected
        assert.equal(Experiments.find().count(), 0);
      });
    });
  });
}