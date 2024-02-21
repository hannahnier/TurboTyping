console.log(`Instructions: 
    Your task is to type the text that will appear below without any mistakes and as fast as you can. Once you are done with the typing, make sure to stop the clock by hitting 'Enter'. 
    
    Ready? `);

if (
  readlineSync.keyIn("Press any key (other than 'Enter') to start the clock.")
) {
  typingTest();
}
