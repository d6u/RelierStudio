export enum NodeConfigFieldType {
  // Generic fields
  Checkbox = 'Checkbox',
  Number = 'Number',
  Radio = 'Radio',
  Select = 'Select',
  Text = 'Text',
  Textarea = 'Textarea',
  // Special fields
  CanvasConfig = 'CanvasConfig',
  InputVariable = 'InputVariable',
  InputVariableList = 'InputVariableList',
  LlmMessages = 'LlmMessages',
  TextareasWithOutputVariables = 'TextareasWithOutputVariables',
  StopSequence = 'StopSequence',
  SubroutineStartSelect = 'SubroutineStartSelect',
}
