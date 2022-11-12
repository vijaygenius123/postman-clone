import "bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

const form = document.querySelector<HTMLFormElement>('[data-form]')
const queryParamsContainer = document.querySelector<HTMLDivElement>('[data-query-params]')
const requestHeadersContainer = document.querySelector<HTMLDivElement>('[data-request-headers]')
const keyValueTemplate = document.querySelector<HTMLTemplateElement>('[data-key-value-template]')
const queryParamAddBtn = document.querySelector<HTMLButtonElement>('[data-add-query-param-btn]')
const requestHeaderAddBtn = document.querySelector<HTMLButtonElement>('[data-add-header-btn]')

queryParamsContainer?.append(createKeyValuePair())
requestHeadersContainer?.append(createKeyValuePair())

queryParamAddBtn?.addEventListener('click',
    () => queryParamsContainer?.append(createKeyValuePair()))
requestHeaderAddBtn?.addEventListener('click',
    () => requestHeadersContainer?.append(createKeyValuePair()))


form?.addEventListener('submit', async (evt) => {
    evt.preventDefault()
    const response = await axios({
        url: document.querySelector<HTMLInputElement>('[data-url]')?.value,
        method: document.querySelector<HTMLInputElement>('[data-method]')?.value,
        params: keyValueParisToObject(queryParamsContainer),
        headers: keyValueParisToObject(requestHeadersContainer),
    })
    console.log(response)
})

function createKeyValuePair(): Node {

    const element = keyValueTemplate?.content.cloneNode(true)

    // @ts-ignore
    element.querySelector<HTMLButtonElement>('[data-remove-btn]').addEventListener('click', (e: any) => {
        e.target.closest('[data-key-value-pair]').remove()
    })
    // @ts-ignore
    return element
}

function keyValueParisToObject(container: HTMLDivElement| null) {
    const pairs = container?.querySelectorAll('[data-key-value-pair]')
    // @ts-ignore
    return [...pairs].reduce((data, pair) => {
        const key = pair.querySelector('[data-key]')?.value,
            value = pair.querySelector('[data-value]')?.value
        if (key === '') return data
        return {...data, [key]: value}
    }, {})
}
