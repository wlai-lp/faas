function lambda(input, callback) {
  setTimeout(() => {
    console.info("Delayed for 1 second.");
  }, "1000");
  callback(null, `Hello World`);
}
