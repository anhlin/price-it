import React from 'react'

interface GuessResultProps {
    guessPrice: string
    actualPrice: string
    onNextPress: () => void
    nextItemLoading: boolean
    score: number
}

export const GuessResult: React.FC<GuessResultProps> = ({guessPrice, actualPrice, onNextPress, score, nextItemLoading}) => {

    return (
        <div>
            <div>
                You guessed: {guessPrice}
            </div>
            <div>
                The actual price was: {actualPrice}
            </div>
            <div>
                Score: {score}
            </div>
            <button disabled={nextItemLoading} type="button" onClick={onNextPress}>Next Item</button>
        </div>
    )
}
