import React, { useState, useEffect } from 'react';
import {ISuggestion} from "./suggestion";
import {IFunctionTag} from "./function-tag";
import {useSuggestionStore} from "./store";
import {useSuggestions} from "./useSuggestion";


const Calculator: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<ISuggestion[]>([]);
    const [result, setResult] = useState<number | string>('');
    const [selectedFunctions, setSelectedFunctions] = useState<IFunctionTag[]>([]);
    const { suggestions, setSuggestions } = useSuggestionStore();
    const { data, isError, error } = useSuggestions();

    useEffect(() => {
        if (data) {
            setSuggestions(data);
        }
    }, [data, setSuggestions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value) {
            const lastWord = value.split(' ').pop() || '';
            setFilteredSuggestions(suggestions.filter((s: ISuggestion) => s.name.startsWith(lastWord)));
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleSuggestionClick = (name: string, value: string) => {
        const words = inputValue.split(' ');
        words.pop();
        const newInputValue = [...words, name].join(' ') + ' ';
        setSelectedFunctions([...selectedFunctions, { name, value }]);
        setInputValue(newInputValue);
        setFilteredSuggestions([]);
    };

    const calculateResult = () => {
        try {
            let expression = inputValue;
            suggestions.forEach((s: ISuggestion) => {
                expression = expression.replaceAll(s.name, s.value.toString());
            });

            // eslint-disable-next-line no-eval
            const evaluatedResult = eval(expression);
            setResult(evaluatedResult);
        } catch (error) {
            setResult('Invalid expression');
        }
    };

    const removeFunctionTag = (index: number) => {
        setSelectedFunctions((prevSelected) => {
            const newSelected = [...prevSelected];
            newSelected.splice(index, 1);

            let newInputValue = '';
            newSelected.forEach((func, i) => {
                newInputValue += func.name;
                if (i < newSelected.length - 1) {
                    const nextOperationMatch = inputValue.match(new RegExp(`${func.name} (\\+|-|\\*|\\/)?`));
                    const nextOperation = nextOperationMatch ? nextOperationMatch[1] : '';
                    newInputValue += ` ${nextOperation} `;
                }
            });
            setInputValue(newInputValue.trim());

            return newSelected;
        });
    };

    if (isError) {
        console.error('Failed to fetch suggestions:', error);
    }

    return (
        <div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px'}}>
                {selectedFunctions.map((func, index) => (
                    <div key={index} style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <div style={{background: '#e0e0e0', padding: '5px 10px', borderRadius: '4px'}}>
                            {func.name}
                        </div>
                        <button onClick={() => removeFunctionTag(index)}>x</button>
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Add a function"
                    style={{flex: '1'}}
                />
            </div>
            <button onClick={calculateResult}>Calculate</button>
            <div>Result: {result}</div>
            {filteredSuggestions.length > 0 && (
                <ul>
                    {filteredSuggestions.map((suggestion: ISuggestion) => (
                        <li key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion.name, suggestion.value.toString())}>
                            {suggestion.name} ({suggestion.value})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Calculator;
