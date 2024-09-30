import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormContext } from '@/contexts/context';
import AlderStep from '../components/pages/AlderStep';
import { StepRef } from '@/common';
import { mockStates, mockSetState } from './mocks';

const renderComponent = () => {
    const ref = React.createRef<StepRef>();
    const renderResult = render(
      <FormContext.Provider value={{ states: mockStates, setState: mockSetState }}>
        <AlderStep ref={ref} />
      </FormContext.Provider>
    );
    return { renderResult, ref };
  };

describe('AlderStep Component', () => {
  it('should display validation errors for AlderStep', () => {
    const { ref } = renderComponent();

    if(ref.current){
        const result = ref.current.onSubmit();
        expect(result).toBe(false);

        const foedselAarInput = screen.getByLabelText('I hvilket år er du født?');
        expect(foedselAarInput).toBeInTheDocument();

        // Finn ut hvordan jeg kan sjekke at errorFields.foedselAar blir trigget slik at feilmeldingen vises ('Du må oppgi et gyldig årstall') 
        /* const errorMessage = screen.getByText('Du må oppgi et gyldig årstall');
        expect(errorMessage).toBeInTheDocument(); */
    }


  });

  it('should clear validation errors on input change', () => {
    renderComponent();

    const foedselAarInput = screen.getByLabelText('I hvilket år er du født?');
    fireEvent.change(foedselAarInput, { target: { value: '1990' } });

    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));
    expect(screen.queryByText('Du må oppgi et gyldig årstall')).not.toBeInTheDocument();
  });
});