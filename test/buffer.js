import {Buffer} from '../lib/buffer.js';
import {describe, it} from './test.js';

  describe('buffer', function() {
    it('should initialize', function() {
      var buffer = new Buffer('first\nsecond');
      buffer.lines.should.deep.equal(['first', 'second']);
    });

    it('allows text to be inserted', function() {
      var buffer = new Buffer();
      buffer.insert({row: 0, col: 0}, 'after', 'abcd');
      buffer.lines.should.deep.equal(['abcd']);
    });

    it('allows text to be deleted', function() {
      var buffer = new Buffer('abcdefg');
      buffer.delete({row: 0, col: 2}, {row: 0, col: 4});
      buffer.lines.should.deep.equal(['abefg']);
    });

    it('allows lines to be joined', function() {
      var buffer = new Buffer('abc\ndef');
      buffer.delete({row: 0, col: 3}, {row: 1, col: 0});
      buffer.lines.should.deep.equal(['abcdef']);
    });

    it('allows lines to be split', function() {
      var buffer = new Buffer('abcd');
      buffer.insert({row: 0, col: 2}, 'after', '\n');
      buffer.lines.should.deep.equal(['ab', 'cd']);
    });

    it('allows text to be deleted (across multiple lines)', function() {
      var buffer = new Buffer('abc\ndef\nghi');
      buffer.delete({row: 0, col: 1}, {row: 2, col: 2});
      buffer.lines.should.deep.equal(['ai']);
    });

    it('should update mark positions (when text is inserted)', function() {
      var buffer = new Buffer('abcd');
      var mark = buffer.mark({row: 0, col: 2});
      buffer.insert({row: 0, col: 2}, 'after', 'xx');
      mark.row.should.equal(0);
      mark.col.should.equal(2);

      buffer.insert({row: 0, col: 2}, 'before', 'xx');
      mark.row.should.equal(0);
      mark.col.should.equal(4);

      buffer.insert({row: 0, col: 2}, 'before', '\nx');
      mark.row.should.equal(1);
      mark.col.should.equal(3);
    });

    it('should update mark positions (when text is deleted)', function() {
      var buffer = new Buffer('abc\ndef\nghi\njkl');
      buffer.clearChanges();
      var mark1 = buffer.mark({row: 0, col: 3});
      var mark2 = buffer.mark({row: 1, col: 1});
      var mark3 = buffer.mark({row: 2, col: 3});
      var mark4 = buffer.mark({row: 3, col: 2});
      buffer.delete({row: 0, col: 1}, {row: 2, col: 1});
      mark1.row.should.equal(0);
      mark1.col.should.equal(1);
      mark2.row.should.equal(0);
      mark2.col.should.equal(1);
      mark3.row.should.equal(0);
      mark3.col.should.equal(3);
      mark4.row.should.equal(1);
      mark4.col.should.equal(2);
    });

    it('should track changes (when a single line is deleted)', function() {
      var buffer = new Buffer('abc\ndef\nghi');
      buffer.clearChanges();
      buffer.delete({row: 1, col: 0}, {row: 2, col: 0});
      buffer.changes.should.deep.equal([
        buffer.change('nochange'),
        buffer.change('nochange', 1)
      ]);
    });

    it('should track changes (when a single line is deleted)', function() {
      var buffer = new Buffer('abc\ndef\nghi');
      buffer.clearChanges();
      buffer.delete({row: 0, col: 3}, {row: 1, col: 3});
      buffer.changes.should.deep.equal([
        buffer.change('nochange'),
        buffer.change('nochange', 1)
      ]);
    });

    it('should track changes (when text is deleted)', function() {
      var buffer = new Buffer('abc\ndef\nghi');
      buffer.clearChanges();
      buffer.delete({row: 0, col: 0}, {row: 1, col: 1});
      buffer.changes.should.deep.equal([
        buffer.change('modified', 1),
        buffer.change('nochange')
      ]);
    });

    it('should track changes (when text is inserted in the middle of a line)', function() {
      var buffer = new Buffer('abc\ndef\nghi');
      buffer.clearChanges();
      buffer.insert({row: 1, col: 1}, 'after', 'x\nx');
      buffer.changes.should.deep.equal([
        buffer.change('nochange'),
        buffer.change('modified'),
        buffer.change('inserted'),
        buffer.change('nochange')
      ]);
    });

    it('should track changes (when a single line is inserted)', function() {
      var buffer = new Buffer('abc\ndef\nghi');
      buffer.clearChanges();
      buffer.insert({row: 1, col: 3}, 'after', '\nxx');
      buffer.lines.should.deep.equal(['abc', 'def', 'xx', 'ghi'])
      buffer.changes.should.deep.equal([
        buffer.change('nochange'),
        buffer.change('nochange'),
        buffer.change('inserted'),
        buffer.change('nochange')
      ]);
    });

    it('should track changes (when a new first line is inserted)', function() {
      var buffer = new Buffer('abc\ndef\nghi');
      buffer.clearChanges();
      buffer.insert({row: 0, col: 0}, 'after', 'xx\n');
      buffer.lines.should.deep.equal(['xx', 'abc', 'def', 'ghi'])
      buffer.changes.should.deep.equal([
        buffer.change('inserted'),
        buffer.change('nochange'),
        buffer.change('nochange'),
        buffer.change('nochange')
      ]);
    });

    it('should track changes (when a line is split)', function() {
      var buffer = new Buffer('abc\ndef');
      buffer.clearChanges();
      buffer.insert({row: 0, col: 1}, 'before', '\n');
      buffer.lines.should.deep.equal(['a', 'bc', 'def']);
      buffer.changes.should.deep.equal([
        buffer.change('modified'),
        buffer.change('inserted'),
        buffer.change('nochange')
      ]);
    });
  });
