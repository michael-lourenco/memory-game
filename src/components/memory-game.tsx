'use client'
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Produtos exemplo - substitua pelos produtos da empresa
  const products = [
    { id: 1, name: "Produto 1", image: "/images/coco.png" },
    { id: 2, name: "Produto 2", image: "/images/areia.png" },
    { id: 3, name: "Produto 3", image: "/images/bola.png" },
    { id: 4, name: "Produto 4", image: "/images/bolsa.png" },
    { id: 5, name: "Produto 5", image: "/images/chapeu.png" },
    { id: 6, name: "Produto 6", image: "/images/oculus.png" },
    { id: 7, name: "Produto 7", image: "/images/sorvete.png" },
    { id: 8, name: "Produto 8", image: "/images/suco.png" },
  ];

  // Inicializa o jogo
  const initializeGame = () => {
    const duplicatedProducts = [...products, ...products];
    const shuffledProducts = duplicatedProducts.sort(() => Math.random() - 0.5);
    setCards(shuffledProducts.map((product, index) => ({
      ...product,
      index,
      isFlipped: false,
      isMatched: false
    })));
    setMatchedPairs([]);
    setFlippedCards([]);
    setShowAll(true);
    setGameStarted(true);
    
    // Esconde as cartas após 3 segundos
    setTimeout(() => {
      setShowAll(false);
    }, 3000);
  };

  // Lida com o clique na carta
  const handleCardClick = (index) => {
    if (!gameStarted || showAll) return;
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(index)) return;
    if (matchedPairs.includes(cards[index].id)) return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      if (cards[firstIndex].id === cards[secondIndex].id) {
        // Par encontrado
        setMatchedPairs([...matchedPairs, cards[firstIndex].id]);
        new Audio('/audios/successo.mp3').play().catch(() => {}); // Som de acerto
        setFlippedCards([]);
      } else {
        // Não é par
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Verifica vitória
  useEffect(() => {
    if (matchedPairs.length === products.length && matchedPairs.length > 0) {
      new Audio('/parabens.mp3').play().catch(() => {}); // Som de vitória
      setTimeout(() => {
        alert('Parabéns! Você completou o jogo!');
      }, 500);
    }
  }, [matchedPairs]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Tela inicial */}
      {!gameStarted && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold mb-8">Nome da Empresa</h1>
          <Button 
            onClick={initializeGame}
            className="px-8 py-4 text-xl"
          >
            Iniciar Jogo
          </Button>
        </div>
      )}

      {/* Grid de cartas */}
      {gameStarted && (
        <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
          {cards.map((card, index) => (
            <Card
              key={index}
              className={`
                aspect-square cursor-pointer transition-all duration-300 transform
                ${(flippedCards.includes(index) || showAll || matchedPairs.includes(card.id)) 
                  ? 'rotate-0' 
                  : 'rotate-180 bg-blue-500'}
              `}
              onClick={() => handleCardClick(index)}
            >
              <div className="w-full h-full flex items-center justify-center">
              {(flippedCards.includes(index) || showAll || matchedPairs.includes(card.id)) ? (
                <div className="w-full h-full p-4">
                  <img 
                    src={card.image} 
                    alt={card.name}
                    className="w-full h-full object-contain"
                  />
                  {/* <p className="text-center mt-2">{card.name}</p> */}
                </div>
              ) : (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(/images/logo.png)`, 
                    transform: 'scaleY(1)' // Garante que a imagem não esteja invertida verticalmente
                  }}
                />
              )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
