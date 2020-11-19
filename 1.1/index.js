let response = '';

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  const key = chunk.toString().charCodeAt(0);

  if (key !== 13) {
    response += chunk;
    process.stdin.resume();
    return;
  }

  console.log(response.split('').reverse().join(''));
  response = '';
  process.stdin.resume();
});
