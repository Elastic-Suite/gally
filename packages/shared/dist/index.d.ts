import * as _mui_material_styles from '@mui/material/styles';
import * as _emotion_react from '@emotion/react';
import { TFunction } from 'react-i18next';
import { FunctionComponent, CSSProperties } from 'react';
import { Theme } from '@mui/system';

declare const apiUrl: string;
declare const gqlUrl: string;
declare const searchableAttributeUrl = "?isSearchable=true";
declare const authHeader = "Authorization";
declare const languageHeader = "Elasticsuite-Language";
declare const contentTypeHeader = "Content-Type";
declare const authErrorCodes: number[];
declare const currentPage = "currentPage";
declare const pageSize = "pageSize";
declare const usePagination = "pagination";
declare const searchParameter = "search";
declare const defaultPageSize = 50;

declare enum HttpCode {
    OK = "200",
    CREATED = "201",
    NO_CONTENT = "204",
    BAD_REQUEST = "400",
    NOT_FOUND = "404",
    UNPROCESSABLE_ENTITY = "422"
}
declare enum Method {
    DELETE = "DELETE",
    GET = "GET",
    PATCH = "PATCH",
    POST = "POST",
    PUT = "PUT"
}
declare enum LoadStatus {
    FAILED = 0,
    IDLE = 1,
    LOADING = 2,
    SUCCEEDED = 3
}
interface IFetchError {
    error: Error;
}
interface IFetch<D> {
    data?: D;
    error?: Error;
    status: LoadStatus;
}
interface IGraphqlResponse<D> {
    data: D;
}
declare type ISearchParameters = Record<string, string | number | boolean | (string | number | boolean)[]>;
declare type IFetchApi<T> = (resource: IResource | string, searchParameters?: ISearchParameters, options?: RequestInit) => Promise<T | IFetchError>;

interface IOption<T> {
    disabled?: boolean;
    id?: string | number;
    label: string;
    value: T;
    default?: boolean;
}
declare type IOptions<T> = IOption<T>[];
declare type IFieldOptions = Map<string, IOptions<string | number>>;
interface IOptionsContext {
    load: (field: IField) => void;
    fieldOptions: IFieldOptions;
}
interface IApiSchemaOptions {
    code: string;
    label: string;
}

declare enum MassiveSelectionType {
    ALL = "massiveselection.all",
    ALL_ON_CURRENT_PAGE = "massiveselection.allOnCurrentPage",
    NONE = "massiveselection.none"
}
declare enum DataContentType {
    STRING = "string",
    BOOLEAN = "boolean",
    TAG = "tag",
    LABEL = "label",
    DROPDOWN = "dropdown",
    IMAGE = "image",
    SCORE = "score",
    STOCK = "stock",
    PRICE = "price",
    NUMBER = "number"
}
interface ITableHeader {
    name: string;
    label: string;
    type?: DataContentType;
    editable?: boolean;
    field?: IField;
    sticky?: boolean;
    options?: IOptions<unknown> | null;
    boostInfos?: IBoost;
    required?: boolean;
}
interface IBaseStyle {
    left: string;
    backgroundColor: string;
    zIndex: string;
}
interface INonStickyStyle {
    borderBottomColor: string;
    backgroundColor: string;
    overflow?: string;
}
interface ISelectionStyle extends IBaseStyle {
    stickyBorderStyle?: IStickyBorderStyle;
}
interface IStickyStyle extends IBaseStyle {
    minWidth: string;
    stickyBorderStyle?: IStickyBorderStyle;
    overflow?: string;
}
interface IDraggableColumnStyle extends IBaseStyle {
    minWidth: string;
    borderRight?: string;
    stickyBorderStyle?: IStickyBorderStyle;
}
interface IStickyBorderStyle {
    borderBottomColor: string;
    borderRight: string;
    borderRightColor: string;
    boxShadow?: string;
    clipPath?: string;
}
interface ITableRow {
    id: string | number;
    [key: string]: string | boolean | number | IScore | IStock;
}
interface IHorizontalOverflow {
    isOverflow: boolean;
    shadow: boolean;
}
interface ITableHeaderSticky extends ITableHeader {
    isLastSticky: boolean;
}
interface IBoost {
    type: 'up' | 'down' | 'no boost';
    boostNumber: number;
    boostMultiplicator: number;
}
interface IScore {
    scoreValue: number;
    boostInfos?: IBoost;
}
declare type BoostType = 'up' | 'down' | 'no boost';
interface IStock {
    status: boolean;
    qty: number;
}

interface IJsonldContext {
    '@context': string;
}
interface IJsonldType {
    '@type': string | string[];
}
interface IJsonldId {
    '@id': string;
}
interface IJsonldBase extends IJsonldType, IJsonldId {
}
interface IJsonldString {
    '@value': string;
}
interface IJsonldBoolean {
    '@value': boolean;
}
interface IJsonldNumber {
    '@value': number;
}
declare type IJsonldValue = IJsonldString | IJsonldBoolean | IJsonldNumber;
interface IJsonldOwlEquivalentClass {
    'http://www.w3.org/2002/07/owl#allValuesFrom': [IJsonldId];
    'http://www.w3.org/2002/07/owl#onProperty': [IJsonldId];
}
interface IJsonldRange {
    'http://www.w3.org/2002/07/owl#equivalentClass': [IJsonldOwlEquivalentClass];
}

declare enum HydraType {
    ARRAY = "array",
    BOOLEAN = "boolean",
    INTEGER = "integer",
    OBJECT = "object",
    STRING = "string"
}
interface IHydraPropertyTypeRef {
    $ref?: string;
}
interface IHydraPropertyTypeArray {
    type: HydraType.ARRAY;
    items: HydraPropertyType;
}
interface IHydraPropertyTypeBoolean {
    type: HydraType.BOOLEAN;
}
interface IHydraPropertyTypeInteger {
    type: HydraType.INTEGER;
    default?: number;
    minimum?: number;
    maximum?: number;
}
interface IHydraPropertyTypeObject {
    type: HydraType.OBJECT;
    properties: Record<string, HydraPropertyType>;
    required?: string[];
}
interface IHydraPropertyTypeString {
    type: HydraType.STRING;
    format?: string;
    nullable?: boolean;
}
declare type HydraPropertyType = IHydraPropertyTypeRef | IHydraPropertyTypeArray | IHydraPropertyTypeBoolean | IHydraPropertyTypeInteger | IHydraPropertyTypeObject | IHydraPropertyTypeString;
interface IOwlEquivalentClass {
    'owl:onProperty': IJsonldId;
    'owl:allValuesFrom': IJsonldId;
}
interface IRdfsRange {
    'owl:equivalentClass': IOwlEquivalentClass;
}
interface IHydraSupportedOperation extends IJsonldType {
    expects?: string;
    'hydra:method': Method;
    'hydra:title'?: string;
    'rdfs:label': string;
    returns: string;
}
interface IHydraProperty extends IJsonldBase {
    domain: string;
    'hydra:supportedOperation'?: IHydraSupportedOperation | IHydraSupportedOperation[];
    'owl:maxCardinality'?: number;
    range?: string;
    'rdfs:label': string;
    'rdfs:range'?: (IJsonldId | IRdfsRange)[];
}
interface IElasticSuiteProperty {
    visible?: boolean;
    editable?: boolean;
    position?: number;
    context?: Record<string, IElasticSuiteProperty>;
    input?: DataContentType;
    options?: IDropdownStaticOptions | IDropdownApiOptions;
}
interface IDropdownStaticOptions {
    values: (string | number)[];
}
interface IDropdownApiOptions {
    api_rest: string;
    api_gaphql: string;
}
interface IHydraSupportedProperty extends IJsonldType {
    'hydra:description'?: string;
    'hydra:property': IHydraProperty;
    'hydra:readable': boolean;
    'hydra:required'?: boolean;
    'hydra:title': string;
    'hydra:writeable': boolean;
    elasticsuite?: IElasticSuiteProperty;
}
interface IHydraSupportedClass extends IJsonldBase {
    'hydra:description'?: string;
    'hydra:supportedOperation'?: IHydraSupportedOperation | IHydraSupportedOperation[];
    'hydra:supportedProperty': IHydraSupportedProperty[];
    'hydra:title': string;
    'rdfs:label'?: string;
    subClassOf?: string;
}
interface IHydraMember extends IJsonldBase {
    id: number | string;
}
interface IHydraLabelMember extends IHydraMember {
    catalog: string;
    label: string;
}
interface IHydraMapping extends IJsonldType {
    variable: string;
    property: string;
    required: boolean;
}
interface IHydraSearch extends IJsonldType {
    'hydra:mapping': IHydraMapping[];
    'hydra:template': string;
    'hydra:variableRepresentation': string;
}
interface IHydraResponse<Member> extends IJsonldContext, IJsonldType, IJsonldId {
    'hydra:member': Member[];
    'hydra:search'?: IHydraSearch;
    'hydra:totalItems': number;
}
interface IExpandedHydraSupportedOperation extends IJsonldType {
    'http://www.w3.org/2000/01/rdf-schema#label': [IJsonldString];
    'http://www.w3.org/ns/hydra/core#expects'?: [IJsonldString];
    'http://www.w3.org/ns/hydra/core#method': [IJsonldString];
    'http://www.w3.org/ns/hydra/core#returns': [IJsonldId];
    'http://www.w3.org/ns/hydra/core#title'?: [IJsonldString];
}
interface IExpandedHydraProperty extends IJsonldBase {
    'http://www.w3.org/2000/01/rdf-schema#domain': [IJsonldId];
    'http://www.w3.org/2000/01/rdf-schema#label': [IJsonldString];
    'http://www.w3.org/2000/01/rdf-schema#range': [IJsonldId] | [IJsonldId, IJsonldRange];
    'http://www.w3.org/2002/07/owl#maxCardinality'?: [IJsonldNumber];
    'http://www.w3.org/ns/hydra/core#supportedOperation'?: IExpandedHydraSupportedOperation[];
}
interface IExpandedElasticSuiteProperty {
    'https://localhost/docs.jsonld#editable'?: [IJsonldBoolean];
    'https://localhost/docs.jsonld#position'?: [IJsonldNumber];
    'https://localhost/docs.jsonld#visible'?: [IJsonldBoolean];
    'https://localhost/docs.jsonld#context'?: [
        Record<string, [IExpandedElasticSuiteProperty]>
    ];
}
interface IExpandedHydraSupportedProperty extends IJsonldType {
    'http://www.w3.org/ns/hydra/core#property': IExpandedHydraProperty[];
    'http://www.w3.org/ns/hydra/core#readable': [IJsonldBoolean];
    'http://www.w3.org/ns/hydra/core#required'?: [IJsonldBoolean];
    'http://www.w3.org/ns/hydra/core#title': [IJsonldString];
    'http://www.w3.org/ns/hydra/core#writeable': [IJsonldBoolean];
    'https://localhost/docs.jsonld#elasticsuite'?: IExpandedElasticSuiteProperty;
}
interface IExpandedHydraSupportedClass extends IJsonldBase {
    'http://www.w3.org/2000/01/rdf-schema#label'?: [IJsonldString];
    'http://www.w3.org/ns/hydra/core#supportedOperation': IExpandedHydraSupportedOperation[];
    'http://www.w3.org/ns/hydra/core#supportedProperty': IExpandedHydraSupportedProperty[];
    'http://www.w3.org/ns/hydra/core#title': [IJsonldString];
}

interface IProperty extends IJsonldBase {
    domain: IJsonldId;
    label: string;
    range?: IJsonldId;
}
interface IField extends IJsonldType {
    description?: string;
    property: IProperty;
    readable: boolean;
    required: boolean;
    title: string;
    writeable: boolean;
    elasticsuite?: IElasticSuiteProperty;
}
interface IOperation extends IJsonldType {
    expects?: string;
    label: string;
    method: Method;
    returns: IJsonldId;
    title: string;
}
interface IResource extends IJsonldBase {
    label: string;
    supportedOperation: IOperation[];
    supportedProperty: IField[];
    title: string;
    url: string;
}
declare type IApi = IResource[];
interface IResponseError {
    code: number;
    message: string;
}
interface IResourceOperations<T extends IHydraMember> {
    create?: (item: Omit<T, 'id' | '@id' | '@type'>) => Promise<T | IFetchError>;
    remove?: (id: string | number) => Promise<T | IFetchError>;
    replace?: (item: Omit<T, '@id' | '@type'>) => Promise<T | IFetchError>;
    update?: (id: string | number, item: Partial<T>) => Promise<T | IFetchError>;
}
declare type IResourceEditableCreate<T> = (item: Omit<T, 'id' | '@id' | '@type'>) => Promise<void>;
declare type IResourceEditableMassUpdate<T> = (ids: (string | number)[], item: Partial<T>) => Promise<void>;
declare type IResourceEditableRemove = (id: string | number) => Promise<void>;
declare type IResourceEditableReplace<T> = (item: Omit<T, '@id' | '@type'>) => Promise<void>;
declare type IResourceEditableUpdate<T> = (id: string | number, item: Partial<T>) => Promise<void>;
interface IResourceEditableOperations<T extends IHydraMember> {
    create?: IResourceEditableCreate<T>;
    massUpdate?: IResourceEditableMassUpdate<T>;
    remove?: IResourceEditableRemove;
    replace?: IResourceEditableReplace<T>;
    update?: IResourceEditableUpdate<T>;
}
declare type ILoadResource = () => void;

interface ILocalizedCatalog extends IJsonldBase {
    id: number;
    name: string;
    code: string;
    locale: string;
    isDefault: boolean;
    localName: string;
}
interface ICatalog extends IHydraMember {
    code: string;
    name: string;
    localizedCatalogs: ILocalizedCatalog[];
}

interface ICategory {
    id: string;
    isVirtual: boolean;
    name: string;
    path: string;
    level: number;
    children?: ICategory[];
}
interface ICategories extends IJsonldBase {
    catalogId?: number;
    localizedCatalogId?: number;
    categories?: ICategory[];
}

interface IDocsJsonContent {
    schema: HydraPropertyType;
}
interface IDocsJsonBody {
    description: string;
    content: Record<string, IDocsJsonContent>;
    required: boolean;
}
interface IDocsJsonParameter {
    name: string;
    in: string;
    description: string;
    required: boolean;
    deprecated: boolean;
    allowEmptyValue: boolean;
    schema: HydraPropertyType;
    style: string;
    explode: boolean;
    allowReserved: boolean;
}
interface IDocsJsonLink {
    operationId: string;
    parameters: Record<string, string>;
    description: string;
}
interface IDocsJsonResponse {
    content?: Record<string, IDocsJsonContent>;
    description: string;
    links?: Record<string, IDocsJsonLink>;
}
declare type DocsJsonResponses = {
    [code in HttpCode]?: IDocsJsonResponse;
};
interface IDocsJsonOperation {
    operationId?: string;
    tags?: string[];
    responses?: DocsJsonResponses;
    summary?: string;
    description?: string;
    parameters: IDocsJsonParameter[];
    requestBody?: IDocsJsonBody;
    deprecated?: boolean;
}
declare type DocsJsonMethods = {
    [method in Lowercase<Method>]?: IDocsJsonOperation;
};
interface IDocsJsonPath extends DocsJsonMethods {
    parameters: string[];
    ref?: string;
}
interface IDocsJsonSecurity {
    apiKey: string[];
}
interface IDocsJsonServer {
    url: string;
    description: string;
}
interface IDocsJsonInfo {
    title: string;
    description: string;
    version: string;
}
interface IDocsJsonSecuritySchemes {
    type: string;
    description: string;
    name: string;
    in: string;
}
interface IDocsJsonComponents {
    schemas: Record<string, HydraPropertyType>;
    responses: DocsJsonResponses;
    parameters: Record<string, unknown>;
    examples: Record<string, unknown>;
    requestBodies: Record<string, unknown>;
    headers: Record<string, unknown>;
    securitySchemes: Record<string, IDocsJsonSecuritySchemes>;
}
interface IDocsJson {
    openapi: string;
    info: IDocsJsonInfo;
    servers: IDocsJsonServer[];
    paths: Record<string, IDocsJsonPath>;
    components: Record<string, IDocsJsonComponents>;
    security: IDocsJsonSecurity[];
    tags: string[];
}

interface IDocsJsonldContext {
    '@vocab': string;
    domain: IJsonldBase;
    expects: IJsonldBase;
    hydra: string;
    owl: string;
    range: IJsonldBase;
    rdf: string;
    rdfs: string;
    returns: IJsonldBase;
    schema: string;
    subClassOf: IJsonldBase;
    xmls: string;
}
interface IDocsJsonld extends IJsonldBase {
    '@context': IDocsJsonldContext;
    'hydra:entrypoint': string;
    'hydra:supportedClass': IHydraSupportedClass[];
    'hydra:title': string;
}
interface IExpandedDocsJsonld extends IJsonldBase {
    'http://www.w3.org/ns/hydra/core#entrypoint': [IJsonldString];
    'http://www.w3.org/ns/hydra/core#supportedClass': IExpandedHydraSupportedClass[];
    'http://www.w3.org/ns/hydra/core#title': [IJsonldString];
}

declare type IEntrypoint = Record<string, string> & IJsonldBase & IJsonldContext;
declare type IExpandedEntrypoint = Record<string, string | string[] | [IJsonldId]> & IJsonldBase;

interface IFieldGuesserProps {
    editable?: boolean;
    field?: IField;
    name: string;
    label?: string;
    multiple?: boolean;
    onChange?: (name: string, value: unknown) => void;
    options?: IOptions<unknown> | null;
    type?: DataContentType;
    useDropdownBoolean?: boolean;
    value: unknown;
    required?: boolean;
}

interface IFilter {
    field: IField;
    id: string;
    label: string;
    multiple?: boolean;
    options?: IOptions<unknown>;
    type?: DataContentType;
}

interface ILogin {
    token: string;
}

interface IMenuChild {
    code: string;
    label: string;
    children?: IMenuChild[];
}
interface IMenu {
    hierarchy: IMenuChild[];
}

interface IMessage {
    id: number;
    message: string;
}
declare type IMessages = IMessage[];

interface IMetadata extends IHydraMember {
    entity: string;
    sourceFields: string[];
}

interface ISearchProducts {
    searchProducts: ISearchProduct;
}
interface ISearchProduct {
    collection: IProduct[];
    paginationInfo: IProductPaginationInfo;
}
interface IFetchProducts {
    data: ISearchProducts;
}
interface IProduct {
    id: string;
    price: string;
    sku: string;
    name: string;
    brand: string;
    stock: IStock;
    score: IScore;
}
interface IProductPaginationInfo {
    lastPage: number;
    totalCount: number;
}
interface IFetchParams {
    options: RequestInit;
    searchParameters: ISearchParameters;
}

interface ITreeItem {
    id: number | string;
    isVirtual: boolean;
    name: string;
    path: string;
    level: number;
    children?: ITreeItem[];
}

declare enum RuleType {
    ATTRIBUTE = "attribute",
    COMBINATION = "combination"
}
declare enum RuleAttributeOperator {
    CONTAINS = "contains",
    DOES_NOT_CONTAINS = "does_not_contains",
    IS_ONE_OF = "is_one_of",
    IS_NOT_ONE_OF = "is_not_one_of",
    GTE = "gte",
    LTE = "lte",
    GT = "gt",
    LT = "lt",
    EQ = "eq",
    NEQ = "neq",
    IS = "is",
    IS_NOT = "is_not"
}
declare enum RuleAttributeType {
    BOOLEAN = "boolean",
    CATEGORY = "category",
    DROPDOWN = "dropdown",
    FLOAT = "float",
    INT = "int",
    NUMBER = "number",
    PRICE = "price",
    REFERENCE = "reference",
    SELECT = "select",
    TEXT = "text"
}
declare enum RuleCombinationOperator {
    ALL = "all",
    ANY = "any"
}
interface IRule {
    type: RuleType;
    value: string | string[];
}
interface IRuleAttribute extends IRule {
    type: RuleType.ATTRIBUTE;
    field: string;
    operator: RuleAttributeOperator | '';
    attribute_type: RuleAttributeType;
}
interface IRuleCombination extends IRule {
    type: RuleType.COMBINATION;
    operator: RuleCombinationOperator;
    children: IRule[];
}
declare type IRuleOptions = Map<string, IOptions<unknown> | ITreeItem[]>;
interface IRuleOptionsContext {
    options: IRuleOptions;
    getAttributeOperatorOptions: (field: string) => IOptions<string>;
    getAttributeType: (field: string) => RuleAttributeType;
    loadAttributeValueOptions: (field: string) => void;
}

interface ISourceFieldLabel extends IHydraLabelMember {
    sourceField: string;
}

interface ISourceFieldOptionLabel extends IHydraLabelMember {
    sourceFieldOption: string;
}

interface ISourceFieldOption extends IHydraLabelMember {
    position: number;
    labels: string[];
    sourceField: string;
}

interface ISourceField extends IHydraMember {
    code: string;
    defaultLabel?: string;
    filterable?: boolean;
    labels?: string[];
    metadata?: string;
    options?: string[];
    searchable?: boolean;
    sortable?: boolean;
    spellchecked?: boolean;
    system?: boolean;
    type?: string;
    usedForRules?: boolean;
    weight?: number;
}

interface ITabContentProps {
    active?: boolean;
}
interface ITab<P = ITabContentProps> {
    Component: FunctionComponent<P>;
    componentProps?: Omit<P, 'active'>;
    id: number;
    label: string;
}
interface IRouterTab extends ITab {
    actions?: JSX.Element;
    default?: true;
    url: string;
}

declare enum Role {
    ADMIN = "ROLE_ADMIN",
    CONTRIBUTOR = "ROLE_CONTRIBUTOR"
}
interface IUser {
    exp: number;
    iat: number;
    roles: Role[];
    username: string;
}

interface ICategorySortingOption extends IJsonldBase {
    id: string;
    label: string;
    code: string;
}

declare const reorderingColumnWidth = 48;
declare const selectionColumnWidth = 80;
declare const stickyColunWidth = 180;
declare const productTableheader: ITableHeader[];
declare const defaultRowsPerPageOptions: number[];

declare const productsQuery = "query getProducts($catalogId: String!, $currentPage: Int, $pageSize: Int) {\n  searchProducts(catalogId: $catalogId, currentPage: $currentPage, pageSize: $pageSize ) {\n    collection {\n      ... on Product {\n        id\n        sku\n        name\n        score\n        stock {\n          status\n        }\n        price\n      }\n    }\n    paginationInfo {\n      lastPage\n      itemsPerPage\n      totalCount\n    }\n  }\n}\n";

declare const booleanRegexp: RegExp;
declare const headerRegexp: RegExp;

declare const emptyCombinationRule: IRuleCombination;
declare const emptyAttributeRule: IRuleAttribute;
declare const operatorsByType: Map<RuleAttributeType, RuleAttributeOperator[]>;

declare const buttonEnterKeyframe: _emotion_react.Keyframes;
declare const theme: _mui_material_styles.Theme;

declare const tokenStorageKey = "elasticSuiteToken";

declare const fieldDropdown: IField;
declare const fieldDropdownWithContext: IField;
declare const fieldDropdownWithApiOptions: IField;
declare const resources: IResource[];
declare const resourceWithRef: IResource;
declare const resource: IResource;
declare const fieldString: IField;
declare const fieldBoolean: IField;
declare const fieldInteger: IField;
declare const fieldRef: IField;
declare const api: IApi;

declare const expandedEntrypoint: IExpandedEntrypoint;
declare const expandedDocs: IExpandedDocsJsonld;
declare const expandedDocsEntrypoint: IExpandedHydraSupportedClass;
declare const expandedProperty: IExpandedHydraProperty;
declare const expandedRange: [IJsonldId] | [IJsonldId, IJsonldRange];

declare const complexRule: {
    type: string;
    operator: string;
    value: string;
    children: {
        type: string;
        operator: string;
        value: string;
        children: ({
            type: string;
            field: string;
            operator: string;
            attribute_type: string;
            value: string;
            children?: undefined;
        } | {
            type: string;
            operator: string;
            value: string;
            children: {
                type: string;
                field: string;
                operator: string;
                attribute_type: string;
                value: string;
            }[];
            field?: undefined;
            attribute_type?: undefined;
        })[];
    }[];
};
declare const attributeRule: IRuleAttribute;
declare const combinationRule: IRuleCombination;

declare class ApiError extends Error {
}
declare class AuthError extends Error {
}
declare function isApiError<T>(json: T | IResponseError): json is IResponseError;
declare function getApiUrl(url?: string): string;
declare function fetchApi<T>(language: string, resource: IResource | string, searchParameters?: ISearchParameters, options?: RequestInit, secure?: boolean): Promise<T>;
declare function removeEmptyParameters(searchParameters?: ISearchParameters): ISearchParameters;
declare type NetworkError = Error | ApiError | AuthError;
declare function log(log: (message: string) => void, error: NetworkError): void;

declare function getSlugArray(data: string[] | string): string[];
declare function findBreadcrumbLabel(findIndex: number, slug: string[], menu: IMenuChild[], deepIndex?: number): string;

declare function findDefaultCatalog(catalogsData: ICatalog[]): ICatalog | null;
declare function getCatalogForSearchProductApi(catalog: number, localizedCatalog: number, catalogsData: ICatalog[]): string;

declare function isFetchError<T>(json: T | IFetchError): json is IFetchError;
declare function normalizeUrl(url?: string): string;
declare function fetchJson<T>(url: string, options?: RequestInit): Promise<{
    json: T;
    response: Response;
}>;

declare function updatePropertiesAccordingToPath(field: IField, path: string): IField;
declare function hasFieldOptions(field: IField): boolean;
declare function isDropdownStaticOptions(options: IDropdownStaticOptions | IDropdownApiOptions): options is IDropdownStaticOptions;

declare function firstLetterUppercase(item: string): string;
declare function firstLetterLowercase(item: string): string;
declare function humanize(label: string): string;
declare function getFieldLabelTranslationArgs(source: string, resource?: string): [string, string];
declare function formatPrice(price: number, currency: string, countryCode: string): string;

declare function getResource(api: IApi, resourceName: string): IResource;
declare function getFieldName(property: string): string;
declare function getField(resource: IResource, name: string): IField;
declare function getFieldType(field: IField): string;
declare function isReferenceField(field: IField): boolean;
declare function getReferencedResource(api: IApi, field: IField): IResource;
declare function getOptionsFromResource<T extends IHydraMember>(response: IHydraResponse<T>): IOptions<string | number>;
declare function getOptionsFromLabelResource<T extends IHydraLabelMember>(response: IHydraResponse<T>): IOptions<string | number>;
declare function getOptionsFromApiSchema(response: IHydraResponse<IApiSchemaOptions>): IOptions<string | number>;
declare function castFieldParameter(field: IField, value: string | string[]): string | number | boolean | (string | number | boolean)[];
declare function isFieldValueValid(field: IField, value: unknown): boolean;
declare function getFilterParameters(resource: IResource, parameters: ISearchParameters): ISearchParameters;

declare function getUniqueLocalName(data: ICatalog): string[];

declare function getOptionsFromEnum<T extends string | number>(enumObject: Record<string, T>, t: TFunction): IOptions<T>;

declare type IExpandedHydraSupportedClassMap = Map<string, IExpandedHydraSupportedClass>;
declare function getDocumentationUrlFromHeaders(headers: Headers): string;
declare function fetchDocs(apiUrl: string): Promise<{
    docs: IExpandedDocsJsonld;
    docsUrl: string;
    entrypoint: IExpandedEntrypoint;
    entrypointUrl: string;
}>;
declare function getSupportedClassMap(jsonld: IExpandedDocsJsonld): IExpandedHydraSupportedClassMap;
declare function isIJsonldRange(range: IJsonldId | IJsonldRange): range is IJsonldRange;
declare function findRelatedClass(supportedClassMap: IExpandedHydraSupportedClassMap, property: IExpandedHydraProperty): IExpandedHydraSupportedClass;
declare function simplifyJsonldObject(property: Record<string, unknown>): unknown;
declare function parseSchema(apiUrl: string): Promise<IApi>;

declare function isCombinationRule(rule: IRule): rule is IRuleCombination;
declare function isAttributeRule(rule: IRule): rule is IRuleAttribute;

declare function storageGet(key: string): string;
declare function storageSet(key: string, value: string): void;
declare function storageRemove(key: string): void;

declare function getCustomScrollBarStyles(theme: Theme): Record<string, CSSProperties>;

interface IMapping extends IHydraMapping {
    field: IField;
    multiple: boolean;
    options?: IOptions<unknown>;
}
declare function getFieldDataContentType(field: IField): DataContentType;
declare function getFieldHeader(field: IField, t: TFunction): ITableHeader;
declare function getFilterType(mapping: IMapping): DataContentType;
declare function getFilter(mapping: IMapping, t: TFunction): IFilter;
declare function getMappings<T extends IHydraMember>(apiData: IHydraResponse<T>, resource: IResource): IMapping[];

declare function getUrl(urlParam: string | URL, searchParameters?: ISearchParameters): URL;
declare function clearParameters(url: URL): URL;
declare function getListParameters(page?: number | false, searchParameters?: ISearchParameters, searchValue?: string): ISearchParameters;
declare function getListApiParameters(page?: number | false, rowsPerPage?: number, searchParameters?: ISearchParameters, searchValue?: string): ISearchParameters;
declare function getRouterUrl(path: string): URL;
declare function getRouterPath(path: string): string;
declare function getAppUrl(path: string, page?: number | false, activeFilters?: ISearchParameters, searchValue?: string): URL;
declare function getParametersFromUrl(url: URL): ISearchParameters;
declare function getPageParameter(parameters: ISearchParameters): number;
declare function getSearchParameter(parameters: ISearchParameters): string;

declare function isValidUser(user?: IUser): boolean;

export { ApiError, AuthError, BoostType, DataContentType, DocsJsonMethods, DocsJsonResponses, HttpCode, HydraPropertyType, HydraType, IApi, IApiSchemaOptions, IBaseStyle, IBoost, ICatalog, ICategories, ICategory, ICategorySortingOption, IDocsJson, IDocsJsonBody, IDocsJsonComponents, IDocsJsonContent, IDocsJsonInfo, IDocsJsonLink, IDocsJsonOperation, IDocsJsonParameter, IDocsJsonPath, IDocsJsonResponse, IDocsJsonSecurity, IDocsJsonSecuritySchemes, IDocsJsonServer, IDocsJsonld, IDocsJsonldContext, IDraggableColumnStyle, IDropdownApiOptions, IDropdownStaticOptions, IElasticSuiteProperty, IEntrypoint, IExpandedDocsJsonld, IExpandedElasticSuiteProperty, IExpandedEntrypoint, IExpandedHydraProperty, IExpandedHydraSupportedClass, IExpandedHydraSupportedOperation, IExpandedHydraSupportedProperty, IFetch, IFetchApi, IFetchError, IFetchParams, IFetchProducts, IField, IFieldGuesserProps, IFieldOptions, IFilter, IGraphqlResponse, IHorizontalOverflow, IHydraLabelMember, IHydraMapping, IHydraMember, IHydraProperty, IHydraPropertyTypeArray, IHydraPropertyTypeBoolean, IHydraPropertyTypeInteger, IHydraPropertyTypeObject, IHydraPropertyTypeRef, IHydraPropertyTypeString, IHydraResponse, IHydraSearch, IHydraSupportedClass, IHydraSupportedOperation, IHydraSupportedProperty, IJsonldBase, IJsonldBoolean, IJsonldContext, IJsonldId, IJsonldNumber, IJsonldOwlEquivalentClass, IJsonldRange, IJsonldString, IJsonldType, IJsonldValue, ILoadResource, ILocalizedCatalog, ILogin, IMenu, IMenuChild, IMessage, IMessages, IMetadata, INonStickyStyle, IOperation, IOption, IOptions, IOptionsContext, IOwlEquivalentClass, IProduct, IProductPaginationInfo, IProperty, IRdfsRange, IResource, IResourceEditableCreate, IResourceEditableMassUpdate, IResourceEditableOperations, IResourceEditableRemove, IResourceEditableReplace, IResourceEditableUpdate, IResourceOperations, IResponseError, IRouterTab, IRule, IRuleAttribute, IRuleCombination, IRuleOptions, IRuleOptionsContext, IScore, ISearchParameters, ISearchProduct, ISearchProducts, ISelectionStyle, ISourceField, ISourceFieldLabel, ISourceFieldOption, ISourceFieldOptionLabel, IStickyBorderStyle, IStickyStyle, IStock, ITab, ITabContentProps, ITableHeader, ITableHeaderSticky, ITableRow, ITreeItem, IUser, LoadStatus, MassiveSelectionType, Method, NetworkError, Role, RuleAttributeOperator, RuleAttributeType, RuleCombinationOperator, RuleType, api, apiUrl, attributeRule, authErrorCodes, authHeader, booleanRegexp, buttonEnterKeyframe, castFieldParameter, clearParameters, combinationRule, complexRule, contentTypeHeader, currentPage, defaultPageSize, defaultRowsPerPageOptions, emptyAttributeRule, emptyCombinationRule, expandedDocs, expandedDocsEntrypoint, expandedEntrypoint, expandedProperty, expandedRange, fetchApi, fetchDocs, fetchJson, fieldBoolean, fieldDropdown, fieldDropdownWithApiOptions, fieldDropdownWithContext, fieldInteger, fieldRef, fieldString, findBreadcrumbLabel, findDefaultCatalog, findRelatedClass, firstLetterLowercase, firstLetterUppercase, formatPrice, getApiUrl, getAppUrl, getCatalogForSearchProductApi, getCustomScrollBarStyles, getDocumentationUrlFromHeaders, getField, getFieldDataContentType, getFieldHeader, getFieldLabelTranslationArgs, getFieldName, getFieldType, getFilter, getFilterParameters, getFilterType, getListApiParameters, getListParameters, getMappings, getOptionsFromApiSchema, getOptionsFromEnum, getOptionsFromLabelResource, getOptionsFromResource, getPageParameter, getParametersFromUrl, getReferencedResource, getResource, getRouterPath, getRouterUrl, getSearchParameter, getSlugArray, getSupportedClassMap, getUniqueLocalName, getUrl, gqlUrl, hasFieldOptions, headerRegexp, humanize, isApiError, isAttributeRule, isCombinationRule, isDropdownStaticOptions, isFetchError, isFieldValueValid, isIJsonldRange, isReferenceField, isValidUser, languageHeader, log, normalizeUrl, operatorsByType, pageSize, parseSchema, productTableheader, productsQuery, removeEmptyParameters, reorderingColumnWidth, resource, resourceWithRef, resources, searchParameter, searchableAttributeUrl, selectionColumnWidth, simplifyJsonldObject, stickyColunWidth, storageGet, storageRemove, storageSet, theme, tokenStorageKey, updatePropertiesAccordingToPath, usePagination };
