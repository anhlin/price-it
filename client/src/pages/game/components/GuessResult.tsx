import React from 'react'
import {Button} from 'react-bootstrap'

interface GuessResultProps {
    guessPrice: string
    actualPrice: string
    onNextPress: () => void
    nextItemLoading: boolean
    score: number
    wasLastTurn: boolean
}

export const GuessResult: React.FC<GuessResultProps> = ({guessPrice, actualPrice, onNextPress, score, nextItemLoading, wasLastTurn}) => {

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
            <Button disabled={nextItemLoading && !wasLastTurn} type="button" onClick={onNextPress}>{wasLastTurn ? 'See Results' : 'Next Item'}</Button>
        </div>
    )
}
