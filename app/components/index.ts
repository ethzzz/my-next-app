import { AIChat } from './pages/ai-chat'
import { FileUpload } from './pages/file-upload'
import * as FunctionComponents from './functions'

const allComponentsMap = new Map<string, React.ComponentType<any>>([
    [AIChat.displayName, AIChat],
    [FileUpload.displayName, FileUpload],
    ...Object.entries(FunctionComponents).map(([name, Component]) => [Component.displayName, Component] as [string, React.ComponentType<any>])
])

export default allComponentsMap