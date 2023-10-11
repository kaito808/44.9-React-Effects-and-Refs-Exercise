import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeckOfCards() {
  const [deckId, setDeckId] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [card, setCard] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Declare the drawCard function
  const drawCard = async () => {
    if (remaining === 0) {
      clearInterval(intervalId); // Stop drawing when no cards are remaining
      alert('Error: no cards remaining!');
      setIsDrawing(false);
      return;
    }

    try {
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
      setCard(response.data.cards[0]);
      setRemaining(response.data.remaining);
    } catch (error) {
      console.error('Error drawing a card:', error);
    }
  };

  useEffect(() => {
    if (isDrawing && remaining > 0) {
      const interval = setInterval(drawCard, 1000);

      setIntervalId(interval);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isDrawing, remaining, intervalId, drawCard]); // Include drawCard in the dependency array

  const createDeck = async () => {
    try {
      const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/');
      setDeckId(response.data.deck_id);
      setRemaining(response.data.remaining);
    } catch (error) {
      console.error('Error creating the deck:', error);
    }
  };

  const toggleDrawing = () => {
    if (isDrawing) {
      clearInterval(intervalId);
      setIsDrawing(false);
    } else {
      if (remaining === 0) {
        alert('Error: no cards remaining!');
      } else {
        setIsDrawing(true);
      }
    }
  };

  return (
    <div className="DeckOfCards">
      <h1>Deck of Cards</h1>
      <button onClick={createDeck}>Create Deck</button>
      <button onClick={toggleDrawing}>
        {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
      </button>
      <p>Cards remaining: {remaining}</p>
      {card && <img src={card.image} alt={card.code} />}
    </div>
  );
}

export default DeckOfCards;
