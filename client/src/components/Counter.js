
function Counter(props) {
  return (
    <div>
      <p>計數：{props.count}</p>
      <button onClick={()=>{props.setCount(props.count+1)}}>+</button>
    </div>
  );
}

export default Counter;
