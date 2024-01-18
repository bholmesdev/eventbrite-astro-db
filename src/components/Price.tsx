import { useState } from "preact/hooks";

export default function QuantityPrice({ price }: { price: number }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <>
      <h3>${(quantity * price) / 100}</h3>
      <label for="quantity">Quantity</label>
      <input
        type="number"
        id="quantity"
        name="quantity"
        min="1"
        max="5"
        defaultValue="1"
        onInput={(event) => {
          setQuantity(parseInt(event.currentTarget.value));
        }}
      />
    </>
  );
}
