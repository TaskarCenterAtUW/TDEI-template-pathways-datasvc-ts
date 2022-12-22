CREATE TABLE IF NOT EXISTS public.pathway_versions
(
    id integer NOT NULL DEFAULT nextval('pathway_versions_id_seq'::regclass),
    tdei_record_id character varying COLLATE pg_catalog."default" NOT NULL,
    confidence_level integer DEFAULT 0,
    tdei_org_id character varying COLLATE pg_catalog."default" NOT NULL,
    tdei_station_id character varying COLLATE pg_catalog."default" NOT NULL,
    file_upload_path character varying COLLATE pg_catalog."default" NOT NULL,
    uploaded_by character varying COLLATE pg_catalog."default" NOT NULL,
    collected_by character varying COLLATE pg_catalog."default" NOT NULL,
    collection_date timestamp without time zone NOT NULL,
    collection_method character varying COLLATE pg_catalog."default" NOT NULL,
    valid_from timestamp without time zone NOT NULL,
    valid_to timestamp without time zone NOT NULL,
    data_source character varying COLLATE pg_catalog."default" NOT NULL,
    pathways_schema_version character varying COLLATE pg_catalog."default" NOT NULL,
    updated_date timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    polygon polygon NOT NULL,
    CONSTRAINT "PK_dab47c971dc937ea4457fdc223c" PRIMARY KEY (id)
)