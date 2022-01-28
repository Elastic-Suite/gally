<?php

namespace Elasticsuite\Example\Model;

interface AttributeInterface
{

    public function getAttributeCode(): string;

    public function getValue(): mixed;
}
