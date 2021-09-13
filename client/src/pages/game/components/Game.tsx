import React, {useEffect, useState} from 'react'
import {WalmartItem} from  '../../../types/walmart-types'
import {Item} from './Item'
import {GuessResult} from './GuessResult'
import {formatUsd} from '../../helpers/formatUsd'
import axios from 'axios'

export const Game: React.FC = () => {

    const [items, setItems] = useState<WalmartItem[]>([])

    const [currentItemIndex, setCurrentItemIndex] = useState(0)

    const [userGuess, setUserGuess] = useState<string>('')

    const [guessSubmitted, setGuessSubmitted] = useState(false)

    const currentItem = items[currentItemIndex]

    const shuffle = (array: WalmartItem[]) => {
        var currentIndex = array.length,  randomIndex;
      
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    useEffect(() => {
        const url = `http://localhost:3030/products_random`
        axios({
            method: 'get',
            url,            
        }).then(res => {
            console.log('res', res.data)
            if (res) {
                setItems(shuffle(res.data))
            }
        })
    }, [guessSubmitted])

    const onGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserGuess(e.target.value)
    }

    const onSubmitGuess = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault()
        setGuessSubmitted(true)
    }
    
    const onNextPress = () => {
        setCurrentItemIndex(prevState => prevState + 1)
        setUserGuess('')
        setGuessSubmitted(false)
    }
    
    const renderResult = () => {
        return (
            <div>
                <GuessResult 
                    guessPrice={formatUsd(userGuess)}
                    actualPrice={formatUsd(currentItem.salePrice.toString())}
                    onNextPress={onNextPress}
                />
            </div>
        )
    }

    const renderCurrentItem = () => {
        return (
            <div>
                <Item 
                    name={currentItem?.name}
                    price={formatUsd(currentItem?.salePrice.toString())}
                    imageSrc={currentItem?.largeImage}
                />
                <form onSubmit={onSubmitGuess}>
                    <label>
                        Guess:
                        <input type="text" value={userGuess} onChange={onGuessChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }

    return (
        guessSubmitted ? renderResult() : renderCurrentItem()
    )
}

