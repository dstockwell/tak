define(['lib/buffer'], function(Buffer, chai) {
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

    it('can be split', function() {
      var buffer = new Buffer('abcd');
      buffer.insert({row: 0, col: 2}, 'after', '\n');
      buffer.lines.should.deep.equal(['ab', 'cd']);
    });
  });
});