import React from 'react'

interface GuessResultProps {
    guessPrice: string
    actualPrice: string
    onNextPress: () => void
}

export const GuessResult: React.FC<GuessResultProps> = ({guessPrice, actualPrice, onNextPress}) => {

    // (1 - ((abs(actual - guess)) / actual)) * 1000

    return (
        <div>
            <div>
                You guessed: {guessPrice}
            </div>
            <div>
                The actual price was: {actualPrice}
            </div>
            <button type="button" onClick={onNextPress}>Next Item</button>
        </div>
    )
}
