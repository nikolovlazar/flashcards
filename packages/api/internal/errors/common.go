package errs

import (
	"fmt"
)

type NotFoundError struct {
	Resource string
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s not found", e.Resource)
}

type OperationError struct {
	Resource  string
	Operation string
}

func (e *OperationError) Error() string {
	return fmt.Sprintf(
		"Failed to %s %s",
		e.Operation,
		e.Resource,
	)
}

type InputParseError struct {
	Field     string
	Condition string
}

func (e *InputParseError) Error() string {
	return fmt.Sprintf(
		"%s %s", e.Field, e.Condition,
	)
}
