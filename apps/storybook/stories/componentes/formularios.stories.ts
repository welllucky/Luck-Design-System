import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta: Meta = {
  title: "Componentes/Formulários",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Campos são **poços** rebaixados com rótulo flutuante. Todos participam de `<form>` nativo (ElementInternals), emitem `luckInput`/`luckChange` e integram com `ngModel` (Angular) e `v-model` (Vue).",
      },
    },
  },
};
export default meta;
type Story = StoryObj;

const email = (v: string) => /^\S+@\S+\.\S+$/.test(v) || "Confira o formato do e-mail.";

export const Input: Story = {
  render: () => html`
    <div class="sb-stack">
      <luck-input label="Nome" icon="sparkles"></luck-input>
      <luck-input label="E-mail" type="email" hint="Respondo em até 2 dias úteis." .validator=${email}></luck-input>
      <luck-input label="Com erro" value="wellington@" error="Confira o formato do e-mail."></luck-input>
      <luck-input label="Desabilitado" disabled></luck-input>
    </div>
  `,
};

export const Textarea: Story = {
  render: () => html`
    <div class="sb-stack">
      <luck-textarea label="Mensagem" hint="Conte sobre o desafio." rows="4"></luck-textarea>
    </div>
  `,
};

export const Select: Story = {
  render: () => html`
    <div class="sb-stack">
      <luck-select
        label="Assunto"
        placeholder="Escolha"
        options='["Projeto", "Mentoria", "Palestra"]'
      ></luck-select>
      <luck-select label="Com opções filhas" icon="building-2">
        <option value="fcx">FCx Labs</option>
        <option value="freela" selected>Freelance</option>
      </luck-select>
    </div>
  `,
};

export const EscolhaESwitch: Story = {
  name: "Checkbox, Radio e Switch",
  render: () => html`
    <div class="sb-stack">
      <luck-checkbox label="Receber novidades" checked></luck-checkbox>
      <luck-checkbox label="Desabilitado" disabled></luck-checkbox>
      <luck-radio-group label="Formato" value="remoto">
        <luck-radio value="remoto" label="Remoto"></luck-radio>
        <luck-radio value="hibrido" label="Híbrido"></luck-radio>
        <luck-radio value="presencial" label="Presencial"></luck-radio>
      </luck-radio-group>
      <luck-switch label="Tema claro"></luck-switch>
      <luck-switch label="Ligado" checked></luck-switch>
    </div>
  `,
};

export const FormularioNativo: Story = {
  name: "Formulário nativo",
  render: () => {
    const submit = (e: SubmitEvent) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
      (document.getElementById("form-out") as HTMLElement).textContent = JSON.stringify(data, null, 2);
    };
    return html`
      <form class="sb-stack" @submit=${submit}>
        <luck-input name="nome" label="Nome" required></luck-input>
        <luck-input name="email" label="E-mail" type="email" required .validator=${email}></luck-input>
        <luck-select name="assunto" label="Assunto" options='["Projeto","Mentoria"]' value="Projeto"></luck-select>
        <luck-textarea name="mensagem" label="Mensagem"></luck-textarea>
        <luck-checkbox name="aceite" label="Pode me responder por e-mail"></luck-checkbox>
        <div class="sb-row">
          <luck-button type="submit" icon-right="send">Enviar mensagem</luck-button>
          <luck-button type="reset" variant="ghost">Limpar</luck-button>
        </div>
        <pre id="form-out" class="luck-mono" style="white-space:pre-wrap"></pre>
      </form>
    `;
  },
};
