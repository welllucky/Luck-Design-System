import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { expect, userEvent, waitFor } from "storybook/test";
import { listen, part, press, ready, readyAll } from "../support/dom";

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
  play: async ({ canvasElement, step }) => {
    const [nome, email, erro, desabilitado] = await readyAll<HTMLLuckInputElement>(canvasElement, "luck-input");

    await step("rótulo visível está associado ao campo", async () => {
      await expect(part(nome, "input")).toHaveAccessibleName("Nome");
    });
    await step("digitar atualiza value e emite luckInput", async () => {
      const events = listen<{ value: string }>(nome, "luckInput");
      await userEvent.type(part(nome, "input"), "Wellington");
      await expect(nome.value).toBe("Wellington");
      await expect(events.at(-1)?.detail.value).toBe("Wellington");
    });
    await step("validator reprova ao sair do campo e explica o erro", async () => {
      const input = part<HTMLInputElement>(email, "input");
      await userEvent.type(input, "wellington@");
      input.blur();
      await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
      await expect(input).toHaveAccessibleDescription(/Confira o formato do e-mail/);
    });
    await step("corrigir o valor mostra o ✓ e limpa o erro", async () => {
      const input = part<HTMLInputElement>(email, "input");
      await userEvent.type(input, "exemplo.com");
      await waitFor(() => expect(part(email, ".field")).toHaveClass("is-valid"));
      await expect(input).not.toHaveAttribute("aria-invalid");
    });
    await step("erro controlado aparece de saída", async () => {
      await expect(part(erro, "input")).toHaveAttribute("aria-invalid", "true");
    });
    await step("desabilitado não recebe digitação", async () => {
      await expect(part(desabilitado, "input")).toBeDisabled();
    });
  },
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
  play: async ({ canvasElement, step }) => {
    const [assunto, filhas] = await readyAll<HTMLLuckSelectElement>(canvasElement, "luck-select");

    await step("options em JSON viram <option> com placeholder", async () => {
      const select = part<HTMLSelectElement>(assunto, "select");
      await expect(select.options).toHaveLength(4);
      await expect(select.value).toBe("");
    });
    await step("escolher emite luckChange", async () => {
      const events = listen<{ value: string }>(assunto, "luckChange");
      await userEvent.selectOptions(part(assunto, "select"), "Mentoria");
      await expect(assunto.value).toBe("Mentoria");
      await expect(events.at(-1)?.detail.value).toBe("Mentoria");
    });
    await step("<option selected> filho define o valor inicial", async () => {
      await expect(filhas.value).toBe("freela");
    });
  },
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
  play: async ({ canvasElement, step }) => {
    const checkbox = await ready<HTMLLuckCheckboxElement>(canvasElement, "luck-checkbox");
    const group = await ready<HTMLLuckRadioGroupElement>(canvasElement, "luck-radio-group");
    const [tema] = await readyAll<HTMLLuckSwitchElement>(canvasElement, "luck-switch");

    await step("checkbox alterna e emite luckChange", async () => {
      const events = listen<{ checked: boolean }>(checkbox, "luckChange");
      // O <input> nativo fica escondido; a pessoa clica no rótulo (caixa + texto).
      await userEvent.click(part(checkbox, "label"));
      await waitFor(() => expect(checkbox.checked).toBe(false));
      await expect(events.at(-1)?.detail.checked).toBe(false);
    });
    await step("radio: clique seleciona e setas navegam", async () => {
      const radios = group.querySelectorAll("luck-radio");
      await userEvent.click(part(radios[1], "label"));
      await waitFor(() => expect(group.value).toBe("hibrido"));
      press(part(radios[1], "input"), "ArrowDown");
      await waitFor(() => expect(group.value).toBe("presencial"));
      press(part(radios[2], "input"), "ArrowDown");
      await waitFor(() => expect(group.value).toBe("remoto"));
      await expect(radios[0].checked).toBe(true);
    });
    await step("switch expõe role=switch e aria-checked", async () => {
      const track = part(tema, "[role=switch]");
      await expect(track).toHaveAttribute("aria-checked", "false");
      await userEvent.click(track);
      await waitFor(() => expect(track).toHaveAttribute("aria-checked", "true"));
    });
    await step("clicar no rótulo do switch também alterna", async () => {
      await userEvent.click(part(tema, "label"));
      await waitFor(() => expect(tema.checked).toBe(false));
    });
  },
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
  play: async ({ canvasElement, step }) => {
    const form = canvasElement.querySelector("form")!;
    const [nome, email] = await readyAll<HTMLLuckInputElement>(canvasElement, "luck-input");
    const mensagem = await ready<HTMLLuckTextareaElement>(canvasElement, "luck-textarea");
    const aceite = await ready<HTMLLuckCheckboxElement>(canvasElement, "luck-checkbox");
    const [enviar, limpar] = await readyAll<HTMLLuckButtonElement>(canvasElement, "luck-button");
    const out = canvasElement.querySelector("#form-out")!;

    await step("campos obrigatórios vazios bloqueiam o envio", async () => {
      await expect(form.checkValidity()).toBe(false);
    });
    await step("preencher e enviar entrega tudo no FormData", async () => {
      await userEvent.type(part(nome, "input"), "Wellington");
      await userEvent.type(part(email, "input"), "w@exemplo.com");
      await userEvent.type(part(mensagem, "textarea"), "Olá");
      await userEvent.click(part(aceite, "label"));
      await expect(form.checkValidity()).toBe(true);
      await userEvent.click(part(enviar, "button"));
      await waitFor(() => expect(out.textContent).toContain('"email": "w@exemplo.com"'));
      await expect(JSON.parse(out.textContent!)).toEqual({
        nome: "Wellington",
        email: "w@exemplo.com",
        assunto: "Projeto",
        mensagem: "Olá",
        aceite: "on",
      });
    });
    await step("type=reset limpa os campos", async () => {
      await userEvent.click(part(limpar, "button"));
      await waitFor(() => expect(nome.value).toBe(""));
      await expect(aceite.checked).toBe(false);
    });
  },
};
