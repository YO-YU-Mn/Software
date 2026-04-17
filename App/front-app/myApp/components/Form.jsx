const Form =()=>{
  return(
    <form>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" />
      <br />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" />
      <br />
      <input type="submit" value="Submit" />
    </form>
  );
}
export default Form;