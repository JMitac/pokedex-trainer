import { Input } from "@/ui/components";
import { useState } from "react";
import { TextInput } from "react-native";

// Componente separado — el useState está en el nivel correcto
interface AgeInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onBlur: () => void;
  error?: string;
  inputRef: React.Ref<TextInput>;
}

export const AgeInput: React.FC<AgeInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  inputRef,
}) => {
  const [inputText, setInputText] = useState(
    value !== undefined && !isNaN(value) ? String(value) : ''
  );

  return (
    <Input
      ref={inputRef}
      label="Edad"
      required
      placeholder="10"
      value={inputText}
      onChangeText={(text) => {
        const digitsOnly = text.replace(/[^0-9]/g, '');
        setInputText(digitsOnly);

        if (digitsOnly === '') {
          onChange(undefined);
          return;
        }
        const num = parseInt(digitsOnly, 10);
        if (!isNaN(num)) {
          onChange(num);
        }
      }}
      onBlur={onBlur}
      error={error}
      hint="Entre 10 y 99 años"
      keyboardType="numeric"
      maxLength={2}
      returnKeyType="next"
      testID="input-age"
    />
  );
};