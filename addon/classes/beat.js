import Ember from 'ember';

/**
 * Provides helper classes that represent musical concepts meant to be used by
 * classes from the Audio module.
 *
 * @module MusicalConcepts
 */

const {
  run: { later }
} = Ember;

/**
 * This class represents a single "beat" for a rhythmic instrument. An instance of this
 * class can be set to `active` or not to facilitate the way that most drum
 * machines work (when a beat is not `active`, the time that it occupies still
 * exists, but it does not cause audio to play, effectively resulting in a
 * "rest"). It provides properties that track when it is played, and when a "rest"
 * is played in it's place.
 *
 * This class does not have the ability to create audio on it's own and is
 * expected be a "child" of one of the Sound classes. See it's implementation in
 * {{#crossLink "BeatTrack"}}BeatTrack{{/crossLink}} for an example.
 *
 *     // Cannot play audio on it's own.
 *     // Must pass in parentPlay and/or parentPlayIn from a parent class.
 *     Beat.create({
 *       _parentPlayIn: this.playIn.bind(this),
 *       _parentPlay: this.play.bind(this),
 *     });
 *
 * @class Beat
 */
const Beat = Ember.Object.extend({

  /**
   * If `active` is `true`, all methods of play will cause this instance to play.
   * If `active` is `false`, the `playIfActive()` and `ifActivePlayIn()`
   * methods will treat this instance as a rest (a timed period of silence).
   *
   * @property active
   * @type {boolean}
   */
  active: false,

  /**
   * Whether a Beat instance is currently playing, considering both active and
   * inactive beats (rests). When switched to `true`, is automatically returned
   * to false after the time specified by the duration property.
   *
   * @property currentTimeIsPlaying
   * @type {boolean}
   * @default false
   */
  currentTimeIsPlaying: false,

  /**
   * Whether a Beat instance is currently playing, considering only active beats.
   * When switched to `true`, is automatically returned to false after the time
   * specified by the duration property.
   *
   * @property isPlaying
   * @type {boolean}
   * @default false
   */
  isPlaying: false,

  /**
   * On Beat instance instantiation, this property should be set to the parent's
   * audioBuffer.duration.
   *
   * @property _audioBufferDuration
   * @type {number|null}
   * @private
   */
  _audioBufferDuration: null,

  /**
   * If specified, Determines length of time, in milliseconds, before isPlaying
   * and currentTimeIsPlaying are automatically switched back to false after
   * having been switched to true. 100ms is used by default.
   *
   * @property duration
   * @type {number}
   * @default 100
   */
  duration: 100,

  /**
   * Calls it's parent's `playIn()` method directly to play the beat in
   * `${offset}` seconds.
   *
   * isPlaying and currentTimeIsPlaying are both marked true after the provided
   * offset has elapsed.
   *
   * @method playIn
   *
   * @param {number} offset Number of seconds from "now" that the audio should
   * play.
   */
  playIn(offset=0) {
    const msOffset = offset * 1000;

    this.get('_parentPlayIn')(offset);

    later(() => this._markPlaying(), msOffset);
    later(() => this._markCurrentTimePlaying(), msOffset);
  },

  /**
   * If the beat is marked `active`, calls it's parent's `playIn()` method
   * directly to play the beat in `${offset}` seconds.
   *
   * If active, isPlaying is marked true after the provided offset has elapsed.
   *
   * currentTimeIsPlaying is marked true after the provided offset has elapsed,
   * even if beat is not active.
   *
   * @method ifActivePlayIn
   *
   * @param {number} offset Number of seconds from "now" that the audio should
   * play.
   */
  ifActivePlayIn(offset=0) {
    const msOffset = offset * 1000;

    if (this.get('active')) {
      this.get('_parentPlayIn')(offset);
      later(() => this._markPlaying(), msOffset);
    }

    later(() => this._markCurrentTimePlaying(), msOffset);
  },

  /**
   * Calls it's parent's `play()` method directly to play the beat immediately.
   *
   * isPlaying and currentTimeIsPlaying are both immediately marked true.
   *
   * @method play
   */
  play() {
    this.get('_parentPlay')();
    this._markPlaying();
    this._markCurrentTimePlaying();
  },

  /**
   * If `active`, calls it's parent's `play()` method directly to play the beat
   * immediately.
   *
   * If `active`, isPlaying is immediately marked true.
   *
   * currentTimeIsPlaying is immediately marked true, even if beat is not active.
   *
   * @method playIfActive
   */
  playIfActive() {
    if (this.get('active')) {
      this.get('_parentPlay')();
      this._markPlaying();
    }

    this._markCurrentTimePlaying();
  },

  /**
   * Sets `isPlaying` to `true` and sets up a timer that sets `isPlaying` back
   * to false after `duration` has elapsed.
   *
   * @method _markPlaying
   * @private
   */
  _markPlaying() {
    this.set('isPlaying', true);
    later(() => this.set('isPlaying', false), this.get('duration'));
  },

  /**
   * Sets `currentTimeIsPlaying` to `true` and sets up a timer that sets
   * `currentTimeIsPlaying` back to false after `duration` has elapsed.
   *
   * @method _markCurrentTimePlaying
   * @private
   */
  _markCurrentTimePlaying() {
    this.set('currentTimeIsPlaying', true);
    later(() => this.set('currentTimeIsPlaying', false), this.get('duration'));
  },
});

export default Beat;
