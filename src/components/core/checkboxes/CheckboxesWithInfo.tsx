import { ReactElement } from 'react';
import styled from 'styled-components';

export interface CheckboxItem {
  id: string;
  name: string;
  label: ReactElement | string;
  description: string;
}

const StyledInput = styled.input`
  color: var(--primary-color);
  :focus {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
`;

export interface CheckboxesProps {
  label: ReactElement | string;
  items: CheckboxItem[];
}

export default function CheckboxesWithInfo(props: CheckboxesProps) {
  return (
    <fieldset className="border-b border-t border-gray-200">
      <legend className="sr-only">{props.label}</legend>
      {props.items.map((item) => (
        <div key={item.id} className="divide-y divide-gray-200">
          <div className="relative flex items-start pb-4 pt-3.5">
            <div className="min-w-0 flex-1 text-sm leading-6">
              <label htmlFor="comments" className="font-medium">
                {item.label}
              </label>
              <p id="comments-description">{item.description}</p>
            </div>
            <div className="ml-3 flex h-6 items-center">
              <StyledInput
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 focus:ring-indigo-600"
              />
            </div>
          </div>
        </div>
      ))}
    </fieldset>
  );
}
