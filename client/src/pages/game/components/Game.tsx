import React, {useEffect, useState} from 'react'
import {WalmartItem} from  '../../../types/walmart-types'
import {GuessData} from '../../../types/game-types'
import {Item} from './Item'
import {GuessResult} from './GuessResult'
import {formatUsd} from '../../helpers/formatUsd'
import {GameResult} from './GameResult'
import {fetchRandomProduct} from '../../../api-methods/walmart-api-methods'
import currency from 'currency.js'
import {Button} from 'react-bootstrap'

export const Game: React.FC = () => {
    // Game States
    const [currentItem, setCurrentItem] = useState<WalmartItem>()
    const [roundNum, setRoundNum] = useState(1)
    const [userGuess, setUserGuess] = useState<string>('')
    const [guessData, setGuessData] = useState<GuessData>()
    const [guessHistory, setGuessHistory] = useState<GuessData[]>([])
    const [totalScore, setTotalScore] = useState(0)

    // UI states
    const [nextItemLoading, setNextItemLoading] = useState(false)
    const [shouldRenderGuessResult, setShouldRenderGuessResult] = useState(false)

    const gameOver = roundNum > 10

    useEffect(() => {
        fetchRandomProduct().then(res => {
            setCurrentItem(res.data[0])
        }).catch(err => {
            console.error('error fetching product', err)
        })
    }, [])

    const loadNextItem = () => {
        setNextItemLoading(true)
        fetchRandomProduct().then(res => {
            setNextItemLoading(false)
            setCurrentItem(res.data[0])
        }).catch(err => {
            console.log('error fetching product', err)
        })
    }

    const onGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserGuess(e.target.value)
    }

    const calculateScore = (actual: string, guess: string) => {
            const currencyActual = currency(actual).value
            const diff = Math.abs(currencyActual - currency(guess).value)
            const percentError = Math.ceil(((diff) / currencyActual) * 100) / 100
            const score = percentError < 1 ? 1000 - (percentError * 1000) : 0

            return score
    }

    const onSubmitGuess = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (currentItem) {
            const guessScore = calculateScore(currentItem.salePrice.toString(), userGuess)
            const guess = {
                guessPrice: userGuess,
                item: currentItem,
                score: guessScore,
            }
            setTotalScore(prev => prev += guessScore)
            loadNextItem()
            setShouldRenderGuessResult(true)
            setGuessData(guess)
            setGuessHistory(prevState => [...prevState, guess])
            setUserGuess('')
        }
    }
    
    const onNextPress = () => {
        setGuessData(undefined)
        setShouldRenderGuessResult(false)
        setRoundNum(prev => prev + 1)
    }

    const onNewGame = () => {
        setGuessData(undefined)
        setTotalScore(0)
        setRoundNum(0)
        setGuessHistory([])
        setShouldRenderGuessResult(false)
    }
    
    const renderResult = () => {
        if (guessData) {
            return (
                <GuessResult 
                    guessPrice={guessData?.guessPrice}
                    actualPrice={guessData.item.salePrice?.toString()}
                    onNextPress={onNextPress}
                    nextItemLoading={nextItemLoading}
                    score={guessData.score}
                    wasLastTurn={roundNum === 10}
                />
            )
        } else {
            return null
        }
    }

    const renderCurrentItem = () => {
        if (currentItem) {
            return (
                <>
                    <Item 
                        name={currentItem?.name}
                        description={currentItem.shortDescription}
                        imageSrc={currentItem?.largeImage}
                    />
                    <form onSubmit={onSubmitGuess}>
                        <label>
                            Guess:
                            <input type="text" value={userGuess} onChange={onGuessChange} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </>
            )
        } else {
            return null
        }
    }
    
    const renderGameResult = () => {
        return (
                <GameResult
                    finalScore={totalScore}
                    guessHistory={guessHistory}
                    onPlayAgainPress={onNewGame}
                />
        )
    }

    const renderRoundAndScore = () => {
        return (
            <>
                <div>
                    Round: {roundNum}
                </div>
                <div>
                    Total score: {totalScore}
                </div>
            </>
        )
    }

    return (
        <div>
            {!gameOver && renderRoundAndScore()}
            {shouldRenderGuessResult ? renderResult() : gameOver ? renderGameResult() : renderCurrentItem()}
        </div>
    )
}

