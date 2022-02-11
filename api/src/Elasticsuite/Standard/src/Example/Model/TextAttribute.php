<?php


namespace Elasticsuite\Example\Model;


class TextAttribute implements AttributeInterface
{
    protected string $attributeCode;
    protected string $value;

    public function __construct($attributeCode, $value)
    {
        $this->attributeCode = $attributeCode;
        $this->value = $value;
    }

    /**
     * @return string
     */
    public function getAttributeCode(): string
    {
        return $this->attributeCode;
    }

    /**
     * @return mixed
     */
    public function getValue(): mixed
    {
        return $this->value;
    }
}
