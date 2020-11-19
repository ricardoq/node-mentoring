function ReadString() {
  console.log('Add a string in order to revert: ');

  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();

    console.log(chunk.toString().split('').reverse().join(''));
    console.log('----------------');
    process.stdin.resume();
  });
}
ReadString();
