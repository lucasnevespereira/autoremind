export const translations = {
  en: {
    // Auth
    signIn: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    name: "Name",
    email: "Email",
    password: "Password",
    yourName: "Your name",
    yourEmail: "your@email.com",
    minimumCharacters: "Minimum 8 characters",
    creatingAccount: "Creating account...",
    signingIn: "Signing in...",

    // App
    autoremind: "AutoRemind",
    maintenanceReminderSystem: "Maintenance reminder system",
    settings: "Settings",
    logout: "Logout",

    // Clients
    clients: "Clients",
    manageMaintenanceReminders: "Manage your maintenance reminders",
    searchByNameCarPhone: "Search by name, car, or phone...",
    addClient: "Add Client",
    noClientsYet: "No clients yet",
    addFirstClient:
      "Add your first client to start managing maintenance reminders",
    noResultsFound: "No results found",
    tryDifferentSearch: "Try adjusting your search",

    // Client Table
    client: "Client",
    vehicle: "Vehicle",
    phone: "Phone",
    maintenance: "Maintenance",
    actions: "Actions",
    scheduled: "Scheduled",
    sent: "Sent",
    overdue: "Overdue",
    dueSoon: "Due Soon",

    // Dialog
    addNewClient: "Add New Client",
    editClient: "Edit Client",
    enterClientDetails:
      "Enter client details to schedule maintenance reminders",
    updateClientDetails: "Update client details",
    clientName: "Client Name",
    phoneNumber: "Phone Number",
    carModel: "Car Model",
    maintenanceDate: "Maintenance Date",
    cancel: "Cancel",
    saveClient: "Save Client",
    saving: "Saving...",
    updating: "Updating...",
    updateClient: "Update Client",
    nameRequired: "Name is required",
    phoneRequired: "Phone is required",
    carRequired: "Car is required",
    dateRequired: "Date is required",

    // Settings
    settingsTitle: "Settings",
    configureBusinessInfo:
      "Configure your business information and SMS notifications",
    backToDashboard: "Back to Dashboard",
    businessInformation: "Business Information",
    businessDetails: "Your business details used in SMS messages",
    businessGarageName: "Business/Garage Name",
    businessNamePlaceholder: "e.g., Auto Service Center",
    businessNameHint:
      "This name will appear in your SMS messages as {garage_name}",

    smsTemplate: "SMS Template",
    customizeMessage: "Customize the message sent to your clients",
    messageTemplate: "Message Template",
    availableVariables: "Available Variables:",
    clientNameVar: "Client's name",
    carModelVar: "Car model",
    maintenanceDateVar: "Maintenance date",
    businessNameVar: "Your business name",

    twilioConfiguration: "Twilio Configuration",
    connectTwilioAccount: "Connect your Twilio account to send SMS",
    requirements: "Requirements",
    twilioReq1: "Phone number must be purchased from Twilio",
    twilioReq2: "Trial accounts can only send to verified numbers",
    twilioReq3: "Use E.164 format: +[country][number]",
    accountSid: "Account SID",
    authToken: "Auth Token",
    twilioPhoneNumber: "Phone Number",
    twilioPhoneHint: "Must be a Twilio number in E.164 format",

    testSms: "Test SMS",
    sendTestMessage: "Send a test message to verify your configuration",
    testPhoneNumber: "Test Phone Number",
    testPhoneHint: "Enter a phone number to receive a test SMS",
    sendTestSms: "Send Test SMS",
    sending: "Sending...",

    saveChanges: "Save Changes",

    // Common
    success: "Success!",
    error: "Error",
    send: "Send",
    deleteConfirmation: "Are you sure you want to delete this client?",
    loading: "Loading...",
    unauthorized: "Unauthorized",

    // Toast Messages
    allFieldsRequired: "All fields are required",
    clientAddedSuccess: "Client added successfully!",
    clientAddError: "Error adding client",
    clientUpdatedSuccess: "Client updated successfully!",
    clientUpdateError: "Error updating client",
    clientNotFound: "Client not found",
    clientDeletedSuccess: "Client deleted successfully!",
    clientDeleteError: "Error deleting client",
    settingsSavedSuccess: "Settings saved successfully!",
    settingsSaveError: "Error saving settings",
    atLeastOneField: "At least one field must be provided",
    testSmsSentSuccess: "Test SMS sent successfully!",
    smsError: "Error sending SMS",
    testSmsError: "Error sending test SMS",
    reminderSentSuccess: "Reminder sent successfully!",
    reminderSendError: "Error sending reminder",
    signedInSuccess: "Signed in successfully.",
    signInFailed: "Sign in failed",
    invalidCredentials: "Invalid email or password.",
    accountCreatedSuccess: "Account created successfully.",
    signUpFailed: "Sign up failed",
    emailInUse: "Email already in use or an error occurred.",

    // Tabs
    business: "Business",
    template: "SMS Template",
    twilioConfig: "Twilio Config",
    test: "Test SMS",

    // Pagination
    showing: "Showing",
    to: "to",
    of: "of",
    results: "results",
    page: "Page",

    // Import/Export
    importClients: "Import Clients",
    exportClients: "Export Clients",
    importExcel: "Import Excel",
    exportExcel: "Export Excel",
    importFromExcel: "Import clients from an Excel file",
    exportToExcel: "Export clients to an Excel file",
    chooseFile: "Choose File",
    importing: "Importing...",
    exporting: "Exporting...",
    errorImportingClients: "Error importing clients.",
    errorReadingFile: "Error reading file.",
    errorExportingClients: "Error exporting clients.",
    clientsImportedSuccess: "clients imported successfully!",
  },
  pt: {
    // Auth
    signIn: "Entrar",
    signUp: "Registar",
    createAccount: "Criar Conta",
    alreadyHaveAccount: "Já tem uma conta?",
    dontHaveAccount: "Não tem uma conta?",
    name: "Nome",
    email: "Email",
    password: "Palavra-passe",
    yourName: "O seu nome",
    yourEmail: "seu@email.com",
    minimumCharacters: "Mínimo 8 caracteres",
    creatingAccount: "A criar conta...",
    signingIn: "A entrar...",

    // App
    autoremind: "AutoRemind",
    maintenanceReminderSystem: "Sistema de lembretes de manutenção",
    settings: "Configurações",
    logout: "Sair",

    // Clients
    clients: "Clientes",
    manageMaintenanceReminders: "Gerir os seus lembretes de manutenção",
    searchByNameCarPhone: "Pesquisar por nome, carro ou telemóvel...",
    addClient: "Adicionar Cliente",
    noClientsYet: "Ainda não tem clientes",
    addFirstClient:
      "Adicione o seu primeiro cliente para começar a gerir lembretes de manutenção",
    noResultsFound: "Nenhum resultado encontrado",
    tryDifferentSearch: "Tente ajustar a sua pesquisa",

    // Client Table
    client: "Cliente",
    vehicle: "Viatura",
    phone: "Telemóvel",
    maintenance: "Manutenção",
    actions: "Ações",
    scheduled: "Agendado",
    sent: "Enviado",
    overdue: "Atrasado",
    dueSoon: "Em Breve",

    // Dialog
    addNewClient: "Adicionar Novo Cliente",
    editClient: "Editar Cliente",
    enterClientDetails:
      "Introduza os detalhes do cliente para agendar lembretes de manutenção",
    updateClientDetails: "Atualizar detalhes do cliente",
    clientName: "Nome do Cliente",
    phoneNumber: "Número de Telemóvel",
    carModel: "Modelo do Carro",
    maintenanceDate: "Data de Manutenção",
    cancel: "Cancelar",
    saveClient: "Guardar Cliente",
    saving: "A guardar...",
    updating: "A atualizar...",
    updateClient: "Atualizar Cliente",
    nameRequired: "Nome é obrigatório",
    phoneRequired: "Telemóvel é obrigatório",
    carRequired: "Carro é obrigatório",
    dateRequired: "Data é obrigatória",

    // Settings
    settingsTitle: "Configurações",
    configureBusinessInfo:
      "Configure as informações do seu negócio e notificações SMS",
    backToDashboard: "Voltar ao Painel",
    businessInformation: "Informações do Negócio",
    businessDetails: "Detalhes do seu negócio usados nas mensagens SMS",
    businessGarageName: "Nome do Negócio/Oficina",
    businessNamePlaceholder: "ex., Centro de Serviço Auto",
    businessNameHint:
      "Este nome aparecerá nas suas mensagens SMS como {garage_name}",

    smsTemplate: "Modelo de SMS",
    customizeMessage: "Personalize a mensagem enviada aos seus clientes",
    messageTemplate: "Modelo de Mensagem",
    availableVariables: "Variáveis Disponíveis:",
    clientNameVar: "Nome do cliente",
    carModelVar: "Modelo do carro",
    maintenanceDateVar: "Data de manutenção",
    businessNameVar: "Nome do seu negócio",

    twilioConfiguration: "Configuração Twilio",
    connectTwilioAccount: "Conecte a sua conta Twilio para enviar SMS",
    requirements: "Requisitos",
    twilioReq1: "O número de telefone deve ser comprado da Twilio",
    twilioReq2: "Contas de teste só podem enviar para números verificados",
    twilioReq3: "Use o formato E.164: +[país][número]",
    accountSid: "Account SID",
    authToken: "Auth Token",
    twilioPhoneNumber: "Número de Telefone",
    twilioPhoneHint: "Deve ser um número Twilio no formato E.164",

    testSms: "Testar SMS",
    sendTestMessage:
      "Envie uma mensagem de teste para verificar a sua configuração",
    testPhoneNumber: "Número de Telefone de Teste",
    testPhoneHint:
      "Introduza um número de telefone para receber um SMS de teste",
    sendTestSms: "Enviar SMS de Teste",
    sending: "A enviar...",

    saveChanges: "Guardar Alterações",

    // Common
    success: "Sucesso!",
    error: "Erro",
    send: "Enviar",
    deleteConfirmation: "Tem a certeza que deseja eliminar este cliente?",
    loading: "A carregar...",
    unauthorized: "Não autorizado",

    // Toast Messages
    allFieldsRequired: "Todos os campos são obrigatórios",
    clientAddedSuccess: "Cliente adicionado com sucesso!",
    clientAddError: "Erro ao adicionar cliente",
    clientUpdatedSuccess: "Cliente atualizado com sucesso!",
    clientUpdateError: "Erro ao atualizar cliente",
    clientNotFound: "Cliente não encontrado",
    clientDeletedSuccess: "Cliente eliminado com sucesso!",
    clientDeleteError: "Erro ao eliminar cliente",
    settingsSavedSuccess: "Configurações guardadas com sucesso!",
    settingsSaveError: "Erro ao guardar configurações",
    atLeastOneField: "Pelo menos um campo deve ser fornecido",
    testSmsSentSuccess: "SMS de teste enviado com sucesso!",
    smsError: "Erro ao enviar SMS",
    testSmsError: "Erro ao enviar SMS de teste",
    reminderSentSuccess: "Lembrete enviado com sucesso!",
    reminderSendError: "Erro ao enviar lembrete",
    signedInSuccess: "Sessão iniciada com sucesso.",
    signInFailed: "Falha ao iniciar sessão",
    invalidCredentials: "Email ou palavra-passe inválidos.",
    accountCreatedSuccess: "Conta criada com sucesso.",
    signUpFailed: "Falha ao criar conta",
    emailInUse: "Email já em uso ou ocorreu um erro.",

    // Tabs
    business: "Negócio",
    template: "Modelo de SMS",
    twilioConfig: "Config. Twilio",
    test: "Testar SMS",

    // Pagination
    showing: "A mostrar",
    to: "a",
    of: "de",
    results: "resultados",
    page: "Página",

    // Import/Export
    importClients: "Importar Clientes",
    exportClients: "Exportar Clientes",
    importExcel: "Importar Excel",
    exportExcel: "Exportar Excel",
    importFromExcel: "Importar clientes de um ficheiro Excel",
    exportToExcel: "Exportar clientes para um ficheiro Excel",
    chooseFile: "Escolher Ficheiro",
    importing: "A importar...",
    exporting: "A exportar...",
    errorImportingClients: "Erro ao importar clientes.",
    errorReadingFile: "Erro ao ler o ficheiro.",
    errorExportingClients: "Erro ao exportar clientes.",
    clientsImportedSuccess: "clientes importados com sucesso!",
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
